const request = require('superagent');
const moment = require('moment');
const { store } = require('./store');
const { superPromise } = require('./promise');
const { sendWatchNotification, sendVehiculeNotification } = require('./push');
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
      sPromise.resolve(sortedVehicules.slice(0, 5));
    });
  return sPromise.promise;
};

const shouldSendNotification = (user, vehicules) => (
  user.vehicules[0] &&
  user.vehicules[0].distance > vehicules[0].distance &&
  (
    !user.vehicule ||
    user.vehicule.distance > vehicules[0].distance
  )
);

const shouldKeepPinging = user => {
  const timeDiff = moment().diff(user.watchTime, 'minutes');
  return timeDiff < PING_DURATION_MINUTES;
};

const checkVehicules = userId => {
  const user = store.getState().users[userId];
  clearTimeout(user.watchTimeout);
  fetchVehicules(user.location)
    .then(vehicules => {
      const user2 = store.getState().users[userId];
      if (!user2.watchTime) return;
      if (shouldSendNotification(user2, vehicules)) sendVehiculeNotification(userId);
      const timeout = !shouldKeepPinging(user2) ? null : setTimeout(
        () => checkVehicules(userId),
        PING_INTERVAL_SECONDS * 1000);
      store.dispatch({
        type: 'WATCH_TIMEOUT',
        userId,
        timeout,
      });
    });
};

const onWatch = ({ userId, time }) => {
  const user = store.getState().users[userId];
  clearTimeout(user.watchTimeout);
  store.dispatch({
    type: 'WATCH',
    userId,
    time,
  });
  if (time) {
    checkVehicules(userId);
    sendWatchNotification(userId);
  }
  return time;
};

module.exports = {
  onWatch,
  fetchVehicules,
};
