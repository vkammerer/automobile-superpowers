const webpush = require('web-push');

const addPushRoutes = (app) => {
  webpush.setVapidDetails(
    `mailto:${process.env.PUSH_EMAIL}`,
    process.env.PUSH_PUBLIC_KEY,
    process.env.PUSH_PRIVATE_KEY
  );
  app.post('/api/push/register', (req, res) => {
    // A real world application would store the subscription info.
    res.sendStatus(201);
  });
  app.post('/api/push/sendNotification', (req, res) => {
    const pushSubscription = {
      endpoint: req.body.endpoint,
      keys: {
        p256dh: req.body.key,
        auth: req.body.authSecret,
      },
    };
    const payload = 'Salut';
    const options = { TTL: 10 };
    webpush.sendNotification(
      pushSubscription,
      payload,
      options
    ).then(() => {
      res.sendStatus(201);
    });
  });
};

module.exports = { addPushRoutes };
