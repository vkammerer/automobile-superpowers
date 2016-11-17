const { users } = require('./users');
const { sendAlarmNotification } = require('./push');

const startAlarm = userId => {
  const user = users[userId];
  if (user.alarmmm && user.alarmmm.timeout) clearTimeout(user.alarmmm.timeout);
  user.alarmmm.time = new Date();
  user.alarmmm.timeout = setTimeout(() => {
    sendAlarmNotification(userId);
  }, 60 * 28 * 1000);
};

module.exports = {
  startAlarm,
};
