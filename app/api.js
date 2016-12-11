const { store } = require('./store');
const { fetchVehicules, getUserVehicules } = require('./utils/vehicules');

const initApi = app => {
  app.post('/api/location', (req, res) => {
    const { lat, lng } = req.body;
    store.dispatch({
      type: 'LOCATION',
      userId: req.cookies.user,
      location: { lat, lng },
    });
    const user = store.getState().users[req.cookies.user];
    res.json(user.location);
  });
  app.get('/api/vehicules', (req, res) => {
    fetchVehicules()
      .then(vehicules => {
        store.dispatch({
          type: 'VEHICULES',
          vehicules,
        });
        const first5Vehicules = getUserVehicules(req.cookies.user).slice(0, 5);
        res.json(first5Vehicules);
      })
      .catch(err => {
        console.warn(err);
        res.json([]);
      });
  });
  app.get('/api/alarm', (req, res) => {
    const user = store.getState().users[req.cookies.user];
    res.json({ time: user.alarmTime });
  });
  app.post('/api/alarm', (req, res) => {
    const { active, pushAuth } = req.body;
    const time = !active ? null : new Date();
    store.dispatch({
      type: 'PUSH_AUTH',
      userId: req.cookies.user,
      pushAuth,
    });
    store.dispatch({
      type: 'ALARM_TIME',
      userId: req.cookies.user,
      time,
    });
    const user = store.getState().users[req.cookies.user];
    res.json({ time: user.alarmTime });
  });
  app.get('/api/vehicule', (req, res) => {
    const user = store.getState().users[req.cookies.user];
    res.json(user.vehicule);
  });
  app.post('/api/vehicule', (req, res) => {
    const { pushAuth, vehicule } = req.body;
    store.dispatch({
      type: 'PUSH_AUTH',
      userId: req.cookies.user,
      pushAuth,
    });
    store.dispatch({
      type: 'VEHICULE',
      userId: req.cookies.user,
      vehicule,
    });
    const user = store.getState().users[req.cookies.user];
    res.json(user.vehicule);
  });
  app.get('/api/watch', (req, res) => {
    const user = store.getState().users[req.cookies.user];
    res.json({ time: user.watchTime });
  });
  app.post('/api/watch', (req, res) => {
    const { active, pushAuth } = req.body;
    const time = !active ? null : new Date();
    store.dispatch({
      type: 'PUSH_AUTH',
      userId: req.cookies.user,
      pushAuth,
    });
    store.dispatch({
      type: 'WATCH_TIME',
      userId: req.cookies.user,
      time,
    });
    const user = store.getState().users[req.cookies.user];
    res.json({ time: user.watchTime });
  });
};

module.exports = { initApi };
