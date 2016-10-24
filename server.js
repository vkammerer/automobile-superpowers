const express = require('express');
const bodyParser = require('body-parser');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const { addPushRoutes } = require('./api/push');
const { addAutomobileRoutes } = require('./api/automobile');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

addPushRoutes(app);
addAutomobileRoutes(app);

app.listen(process.env.PORT || 8080);
