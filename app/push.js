const webpush = require('web-push');
const { superPromise } = require('./promise');
const { users } = require('./users');

webpush.setVapidDetails(
  `mailto:${process.env.PUSH_EMAIL}`,
  process.env.PUSH_PUBLIC_KEY,
  process.env.PUSH_PRIVATE_KEY
);

const pushOptions = { TTL: 10 };

const sendAlarmNotification = userId => {
  const user = users[userId];
  const sPromise = superPromise();
  webpush.sendNotification(
    user.pushAuth,
    'Alarm set 28 minutes ago',
    pushOptions
  ).then(() => {
    sPromise.resolve();
  }, err => {
    console.log('sendAlarmNotification err', err);
    sPromise.reject(err);
  });
  return sPromise.promise;
};

const sendSubscriptionNotification = userId => {
  const user = users[userId];
  const sPromise = superPromise();
  webpush.sendNotification(
    user.pushAuth,
    'You are now subscribed to the closest automobiles',
    pushOptions
  ).then(() => {
    sPromise.resolve();
  }, err => {
    console.log('sendSubscriptionNotification err', err);
    sPromise.reject(err);
  });
  return sPromise.promise;
};

const sendVehiculeNotification = userId => {
  const user = users[userId];
  const sPromise = superPromise();
  const legibleDistance = parseInt(user.vehicules.data[0].distance * 100000, 10);
  webpush.sendNotification(
    user.pushAuth,
    `New automobile at ${legibleDistance} meters`,
    pushOptions
  ).then(() => {
    sPromise.resolve();
  }, err => {
    console.log('sendVehiculeNotification err', err);
    sPromise.reject(err);
  });
  return sPromise.promise;
};

module.exports = {
  sendAlarmNotification,
  sendSubscriptionNotification,
  sendVehiculeNotification,
};
