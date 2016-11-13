const request = require('superagent');
const moment = require('moment');
const { superPromise } = require('./promise');
const { sendVehiculeNotification } = require('./push');
const { sortVehicules } = require('./sort');
const { users } = require('./users');

const URI = 'https://www.reservauto.net/WCF/LSI/LSIBookingService.asmx/GetVehicleProposals';
const PING_INTERVAL_SECONDS = 15;
const PING_DURATION_MINUTES = 60;

const fetchVehicules = ({ lat, lng }) => {
  const sPromise = superPromise();
  request
    .get(URI)
    .query({ CustomerID: '""' })
    .query({ Latitude: lat })
    .query({ Longitude: lng })
    .set('Host', 'www.reservauto.net')
    .set('Referer', 'https://www.reservauto.net/Scripts/Client/Mobile/Default.asp?BranchID=1')
    .set('Accept', 'application/json')
    .then(pData => {
      const JSONData = pData.res.text.substring(1).substring(0, pData.res.text.length - 3);
      const sortedVehicules = sortVehicules(JSON.parse(JSONData).Vehicules, { lat, lng });
      sPromise.resolve(sortedVehicules.slice(0, 10));
    });
  return sPromise.promise;
};

const shouldSendNotification = (user, vehicules) => {
  const currentVehicules = users[user.id].vehicules;
  return !!(currentVehicules && currentVehicules[0].distance > vehicules[0].distance);
};

const checkVehicules = userId => {
  const user = users[userId];
  if (user.timeout) clearTimeout(user.subscription.timeout);
  fetchVehicules(user.position)
    .then(vehicules => {
      if (!user.subscription) return null;
      const mustSendNotification = shouldSendNotification(user, vehicules);
      console.log(mustSendNotification, vehicules[0].distance);
      user.vehicules = vehicules;
      if (mustSendNotification) sendVehiculeNotification(userId);
      const timeDiff = moment().diff(user.subscription.time, 'minutes');
      if (timeDiff < PING_DURATION_MINUTES)
        return (user.subscription.timeout = setTimeout(() => {
          checkVehicules(userId);
        }, PING_INTERVAL_SECONDS * 1000));
      return (user.vehicules = undefined);
    });
};

module.exports = {
  fetchVehicules,
  checkVehicules,
};
