const moment = require('moment');
const { store, subscribeStore } = require('./store');
const { fetchVehicules } = require('./utils/vehicules');
const { checkIfShouldSendVehiculeNotifications } = require('./utils/vehicules');

const WATCH_INTERVAL_SECONDS = 15;
const WATCH_DURATION_MINUTES = 59;

let watchTime;
let watchTimeout;

const shouldKeepPinging = () => {
  const timeDiff = moment().diff(watchTime, 'minutes');
  return timeDiff < WATCH_DURATION_MINUTES;
};

const checkVehicules = () => {
  clearTimeout(watchTimeout);
  fetchVehicules()
    .then(vehicules => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(vehicules);
      }
      watchTimeout = !shouldKeepPinging() ? null : setTimeout(
        checkVehicules,
        WATCH_INTERVAL_SECONDS * 1000);
      store.dispatch({
        type: 'VEHICULES',
        vehicules,
      });
      checkIfShouldSendVehiculeNotifications();
    });
};

const subscribeWatch = () => {
  subscribeStore(({ p, s }) => {
    if (p.watchTime !== s.watchTime) {
      watchTime = s.watchTime;
      checkVehicules();
    }
  });
};

module.exports = {
  subscribeWatch,
};
