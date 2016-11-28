const webpush = require('web-push');
const { superPromise } = require('./promise');
const { store } = require('../store');

webpush.setVapidDetails(
  `mailto:${process.env.PUSH_EMAIL}`,
  process.env.PUSH_PUBLIC_KEY,
  process.env.PUSH_PRIVATE_KEY
);

const pushOptions = { TTL: 15 };

const sendAlarmNotification = userId => {
  const user = store.getState().users[userId];
  const sPromise = superPromise();
  webpush.sendNotification(
    user.pushAuth,
    'Alarm set 29 minutes ago',
    pushOptions
  ).then(() => {
    sPromise.resolve();
  }, err => {
    console.log('sendAlarmNotification err', err);
    sPromise.reject(err);
  });
  return sPromise.promise;
};

const sendWatchNotification = userId => {
  const user = store.getState().users[userId];
  const sPromise = superPromise();
  webpush.sendNotification(
    user.pushAuth,
    'You are now watching',
    pushOptions
  ).then(() => {
    sPromise.resolve();
  }, err => {
    console.log('sendWatchNotification err', err);
    sPromise.reject(err);
  });
  return sPromise.promise;
};

const sendVehiculeNotification = (userId, vehicule) => {
  const user = store.getState().users[userId];
  const sPromise = superPromise();
  webpush.sendNotification(
    user.pushAuth,
    `New automobile at ${vehicule.distance} meters`,
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
  sendWatchNotification,
  sendVehiculeNotification,
};
