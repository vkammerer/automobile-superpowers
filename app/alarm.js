const { values } = require('lodash');
const { store, subscribeStore } = require('./store');
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
  subscribeStore(({ p, s }) => {
    const updatedAlarmUser = values(s.users).find(user => {
      const pUser = p.users[user.id];
      return pUser.alarmTime !== user.alarmTime;
    });
    if (updatedAlarmUser) onAlarm(updatedAlarmUser.id);
  });
};

module.exports = {
  subscribeAlarm,
};
