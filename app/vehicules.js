const request = require('superagent');
const moment = require('moment');
const { superPromise } = require('./promise');
const { users } = require('./users');
const { sendSubscriptionNotification, sendVehiculeNotification } = require('./push');
const { sortVehicules } = require('./sort');

const URI = 'https://www.reservauto.net/WCF/LSI/LSIBookingService.asmx/GetVehicleProposals';
const PING_INTERVAL_SECONDS = 15;
const PING_DURATION_MINUTES = 59;

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
  return (
    currentVehicules &&
    currentVehicules[0] &&
    currentVehicules[0].distance > vehicules[0].distance
  );
};

const checkVehicules = userId => {
  const user = users[userId];
  if (user.subscriptionTimeout) clearTimeout(user.subscriptionTimeout);
  return fetchVehicules(user.position)
    .then(vehicules => {
      if (!user.subscriptionTime) return null;
      const mustSendNotification = shouldSendNotification(user, vehicules);
      user.vehicules = vehicules;
      if (mustSendNotification) sendVehiculeNotification(userId);
      const timeDiff = moment().diff(user.subscriptionTime, 'minutes');
      if (timeDiff < PING_DURATION_MINUTES)
        return (user.subscriptionTimeout = setTimeout(() => {
          checkVehicules(userId);
        }, PING_INTERVAL_SECONDS * 1000));
      return (user.vehicules = []);
    });
};

const listenToVehicules = userId => {
  const user = users[userId];
  user.subscriptionTime = new Date();
  checkVehicules(userId);
  sendSubscriptionNotification(userId);
};

module.exports = {
  fetchVehicules,
  listenToVehicules,
};
