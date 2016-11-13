const webpush = require('web-push');
const { users } = require('./users');
const { superPromise } = require('./promise');

webpush.setVapidDetails(
  `mailto:${process.env.PUSH_EMAIL}`,
  process.env.PUSH_PUBLIC_KEY,
  process.env.PUSH_PRIVATE_KEY
);

const pushOptions = { TTL: 10 };

const sendConfirmationNotification = userId => {
  const user = users[userId];
  const sPromise = superPromise();
  webpush.sendNotification(
    user.subscription.pushSubscription,
    'You are now subscribed to the closest automobiles',
    pushOptions
  ).then(() => {
    sPromise.resolve();
  }, err => {
    console.log(err);
    sPromise.reject(err);
  });
  return sPromise.promise;
};

const sendVehiculeNotification = userId => {
  const user = users[userId];
  const sPromise = superPromise();
  const legibleDistance = parseInt(user.vehicules[0].distance * 100000, 10);
  webpush.sendNotification(
    user.subscription.pushSubscription,
    `New automobile at ${legibleDistance} meters`,
    pushOptions
  ).then(() => {
    sPromise.resolve();
  }, err => {
    sPromise.reject(err);
  });
  return sPromise.promise;
};

module.exports = {
  sendConfirmationNotification,
  sendVehiculeNotification,
};
