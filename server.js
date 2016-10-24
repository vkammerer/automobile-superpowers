const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const { addPushRoutes } = require('./api/push');
const { addAutomobileRoutes } = require('./api/automobile');

const app = express();

app.use(express.static('public'));
app.get('/cached/scripts/sw-toolbox.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'node_modules', 'sw-toolbox', 'sw-toolbox.js'));
});
app.use(bodyParser.json());

addPushRoutes(app);
addAutomobileRoutes(app);

app.listen(process.env.PORT || 8080);
