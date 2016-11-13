const { users } = require('./users');
const { fetchVehicules, checkVehicules } = require('./automobile');
const { sendConfirmationNotification } = require('./push');

const initApi = app => {
  app.post('/api/location', (req, res) => {
    const user = users[req.cookies.user];
    const { lat, lng } = req.body;
    user.position = { lat, lng };
    res.json({ lat, lng });
  });
  app.get('/api/vehicules', (req, res) => {
    const user = users[req.cookies.user];
    return fetchVehicules(user.position)
      .then(vehicules => {
        user.vehicules = vehicules;
        res.json(vehicules);
      });
  });
  app.post('/api/subscribe', (req, res) => {
    const user = users[req.cookies.user];
    user.subscription = {
      pushSubscription: {
        endpoint: req.body.endpoint,
        keys: {
          p256dh: req.body.key,
          auth: req.body.authSecret,
        },
      },
      time: new Date(),
    };
    checkVehicules(req.cookies.user);
    sendConfirmationNotification(req.cookies.user).then(() => {
      res.json(user.subscription);
    });
  });
  app.get('/api/unsubscribe', (req, res) => {
    const user = users[req.cookies.user];
    clearTimeout(user.subscription.timeout);
    user.subscription = null;
    res.sendStatus(200);
  });
};

module.exports = { initApi };
