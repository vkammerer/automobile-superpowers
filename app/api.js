const { store } = require('./store');
const { fetchVehicules, onWatch } = require('./vehicules');
const { onAlarm } = require('./alarm');
const { sortVehicules } = require('./sort');

const initApi = app => {
  app.post('/api/location', (req, res) => {
    const { lat, lng } = req.body;
    store.dispatch({
      type: 'LOCATION',
      userId: req.cookies.user,
      location: { lat, lng },
    });
    res.json({ lat, lng });
  });

  const generateVehicules = ({ location, vehicule, vehicules }) => {
    if (!vehicule) return vehicules;
    const vehiculeInVehicules = vehicules.find(v => v.Name === vehicule.Name);
    if (vehiculeInVehicules) {
      Object.assign(vehiculeInVehicules, { selected: true });
      return vehicules;
    }
    const augmentedVehicule = Object.assign({}, vehicule, { selected: true });
    return sortVehicules([...vehicules.slice(0, 4), augmentedVehicule], location);
  };

  app.get('/api/vehicules', (req, res) => {
    const state = store.getState();
    const user = state.users[req.cookies.user];
    fetchVehicules(user.location).then(vehicules => {
      store.dispatch({
        type: 'VEHICULES',
        userId: req.cookies.user,
        vehicules,
      });
      const allVehicules = generateVehicules({
        location: user.location,
        vehicule: user.vehicule,
        vehicules,
      });
      res.json(allVehicules);
    });
  });
  app.get('/api/alarm', (req, res) => {
    const state = store.getState();
    const user = state.users[req.cookies.user];
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
    onAlarm({
      userId: req.cookies.user,
      time,
    });
    res.json({ time });
  });
  app.get('/api/watch', (req, res) => {
    const state = store.getState();
    const user = state.users[req.cookies.user];
    res.json({ time: user.watchTime });
  });
  app.get('/api/vehicule', (req, res) => {
    const state = store.getState();
    const user = state.users[req.cookies.user];
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
    const updatedVehicule = store.getState().users[req.cookies.user].vehicule;
    res.json(updatedVehicule);
  });
  app.post('/api/watch', (req, res) => {
    const { active, pushAuth } = req.body;
    const time = !active ? null : new Date();
    store.dispatch({
      type: 'PUSH_AUTH',
      userId: req.cookies.user,
      pushAuth,
    });
    onWatch({
      userId: req.cookies.user,
      time,
    });
    res.json({ time });
  });
};

module.exports = { initApi };
