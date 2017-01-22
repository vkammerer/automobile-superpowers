const { values } = require('lodash');
const { store } = require('./store');
const { observeStore } = require('../common/redux-observer');
const { sendAlarmNotification } = require('./utils/push');

const ALARM_DURATION_MINUTES = 29;

const onAlarm = userId => {
  const user = store.getState().users[userId];
  if (!user) return;
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
      const pUserAlarmTime = (!p || !p.users || !p.users[user.id])
        ? null : p.users[user.id].alarmTime;
      if (!pUserAlarmTime && !user.alarmTime) return false;
      if (!pUserAlarmTime && user.alarmTime) return true;
      if (pUserAlarmTime && !user.alarmTime) return true;
      if (new Date(pUserAlarmTime).getTime() ===
        new Date(user.alarmTime).getTime()) return false;
      return true;
    });
    if (updatedAlarmUser) onAlarm(updatedAlarmUser.id);
  });
};

module.exports = {
  subscribeAlarm,
};
