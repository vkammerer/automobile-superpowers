const moment = require('moment');
const { store } = require('./store');
const { fetchVehicules } = require('./utils/vehicules');
const { checkIfShouldSendVehiculeNotifications } = require('./utils/vehicules');
const { observeStore } = require('../common/redux-observer');

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
      watchTimeout = !shouldKeepPinging() ? null : setTimeout(
        checkVehicules,
        WATCH_INTERVAL_SECONDS * 1000);
      store.dispatch({
        type: 'VEHICULES',
        vehicules,
      });
      checkIfShouldSendVehiculeNotifications();
    })
    .catch(err => {
      console.warn(err);
      watchTimeout = !shouldKeepPinging() ? null : setTimeout(
        checkVehicules,
        WATCH_INTERVAL_SECONDS * 1000);
    });
};

const subscribeWatch = () => {
  observeStore(store, s => s, ({ p, s }) => {
    const pWatchTime = !p ? null : p.watchTime;
    if (pWatchTime !== s.watchTime) {
      watchTime = s.watchTime;
      checkVehicules();
    }
  });
};

module.exports = {
  subscribeWatch,
};
