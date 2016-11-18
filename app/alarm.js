const { users } = require('./users');
const { sendAlarmNotification } = require('./push');

const startAlarm = userId => {
  const user = users[userId];
  if (user.alarmTimeout) clearTimeout(user.alarmTimeout);
  user.alarmTime = new Date();
  user.alarmTimeout = setTimeout(() => {
    sendAlarmNotification(userId);
  }, 60 * 29 * 1000);
};

module.exports = { startAlarm };
