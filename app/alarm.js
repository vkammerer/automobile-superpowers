const { values } = require('lodash');
const { store } = require('./store');
const { observeStore } = require('../common/redux-observer');
const { sendAlarmNotification } = require('./utils/push');

const ALARM_DURATION_MINUTES = 29;

const onAlarm = userId => {
  const user = store.getState().users[userId];
  clearTimeout(user.alarmTimeout);
  const timeout = !user.alarmTime ? null : setTimeout(() => {
    sendAlarmNotification(userId);
  }, ALARM_DURATION_MINUTES * 60 * 1000);
  setTimeout(() => {
    store.dispatch({
      type: 'ALARM_TIMEOUT',
      userId,
      timeout,
    });
  }, 0);
};

const subscribeAlarm = () => {
  observeStore(store, s => s, ({ p, s }) => {
    const updatedAlarmUser = values(s.users).find(user => {
      const pUserAlarmTime = !p ? null : p.users[user.id].alarmTime;
      return pUserAlarmTime !== user.alarmTime;
    });
    if (updatedAlarmUser) onAlarm(updatedAlarmUser.id);
  });
};

module.exports = {
  subscribeAlarm,
};
