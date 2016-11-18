const { users } = require('./users');
const { listenToVehicules, fetchVehicules } = require('./vehicules');
const { startAlarm } = require('./alarm');

const initApi = app => {
  app.post('/api/location', (req, res) => {
    const user = users[req.cookies.user];
    const { lat, lng } = req.body;
    user.position = { lat, lng };
    return res.json(user.position);
  });
  app.get('/api/vehicules', (req, res) => {
    const user = users[req.cookies.user];
    return fetchVehicules(user.position).then(vehicules => {
      user.vehicules = vehicules;
      res.json(user.vehicules);
    });
  });
  app.get('/api/alarm', (req, res) => {
    const user = users[req.cookies.user];
    return res.json({ time: user.alarmTime });
  });
  app.post('/api/alarm', (req, res) => {
    const user = users[req.cookies.user];
    const { active, pushAuth } = req.body;
    user.pushAuth = pushAuth;
    if (!active) {
      clearTimeout(user.alarmTimeout);
      user.alarmTime = null;
      return res.json({ time: user.alarmTime });
    }
    startAlarm(req.cookies.user);
    return res.json({ time: user.alarmTime });
  });
  app.post('/api/subscription', (req, res) => {
    const user = users[req.cookies.user];
    const { active, pushAuth } = req.body;
    user.pushAuth = pushAuth;
    if (!active) {
      clearTimeout(user.subscriptionTimeout);
      user.subscriptionTime = null;
      return res.json({ time: user.subscriptionTime });
    }
    listenToVehicules(req.cookies.user);
    return res.json({ time: user.subscriptionTime });
  });
  app.get('/api/subscription', (req, res) => {
    const user = users[req.cookies.user];
    return res.json({ time: user.subscriptionTime });
  });
};

module.exports = { initApi };
