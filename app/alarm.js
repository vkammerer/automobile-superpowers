const { store } = require('./store');
const { sendAlarmNotification } = require('./push');

const ALARM_DURATION_MINUTES = 29;

const onAlarm = ({ userId, time }) => {
  const state = store.getState();
  clearTimeout(state.users[userId].alarmTimeout);
  const timeout = !time ? null : setTimeout(() => {
    sendAlarmNotification(userId);
  }, ALARM_DURATION_MINUTES * 60 * 1000);
  store.dispatch({
    type: 'ALARM',
    userId,
    time,
    timeout,
  });
  return time;
};

module.exports = { onAlarm };
