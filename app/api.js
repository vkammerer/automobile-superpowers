const { users } = require('./users');
const { listenToVehicules, fetchVehicules } = require('./vehicules');
const { startAlarm } = require('./alarm');

const initApi = app => {
  app.post('/api/location', (req, res) => {
    const user = users[req.cookies.user];
    const { lat, lng } = req.body;
    user.position = { lat, lng };
    return res.json({ lat, lng });
  });
  app.get('/api/vehicules', (req, res) => {
    const user = users[req.cookies.user];
    return fetchVehicules(user.position).then(vehicules => {
      user.vehicules.data = vehicules;
      res.json(vehicules);
    });
  });
  app.get('/api/alarm', (req, res) => {
    const user = users[req.cookies.user];
    return res.json({ time: user.alarmmm.time });
  });
  app.post('/api/alarm', (req, res) => {
    const user = users[req.cookies.user];
    const { active, pushAuth } = req.body;
    user.pushAuth = pushAuth;
    if (!active) {
      clearTimeout(user.alarmmm.timeout);
      user.alarmmm.time = null;
      return res.json({ time: user.alarmmm.time });
    }
    startAlarm(req.cookies.user);
    return res.json({ time: user.alarmmm.time });
  });
  app.post('/api/subscription', (req, res) => {
    const user = users[req.cookies.user];
    const { active, pushAuth } = req.body;
    user.pushAuth = pushAuth;
    if (!active) {
      clearTimeout(user.subscriptionnn.timeout);
      user.subscriptionnn.time = null;
      return res.json({ time: user.subscriptionnn.time });
    }
    listenToVehicules(req.cookies.user);
    return res.json({ time: user.subscriptionnn.time });
  });
  app.get('/api/subscription', (req, res) => {
    const user = users[req.cookies.user];
    return res.json({ time: user.subscriptionnn.time });
  });
};

module.exports = { initApi };
