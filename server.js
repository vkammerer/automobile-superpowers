const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const enforce = require('express-sslify');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const { initApi } = require('./app/api');
const { subscribeAlarm } = require('./app/alarm');
const { subscribeWatch } = require('./app/watch');

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

const publicCookieOptions = { maxAge: 10 * 365 * 24 * 60 * 60 * 1000 };
const privateCookieOptions = { maxAge: 10 * 365 * 24 * 60 * 60 * 1000, httpOnly: true };
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res, next) => {
  if (
    !req.body ||
    !req.body.user ||
    !process.env.USERS.split(' ').includes(req.body.user) ||
    !req.body.password ||
    process.env.PASSWORD !== req.body.password
  ) return next();
  res.cookie('user', req.body.user, publicCookieOptions);
  res.cookie('password', req.body.password, privateCookieOptions);
  return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.all('*', (req, res, next) => {
  if (!req.cookies.user || req.cookies.password !== process.env.PASSWORD)
    return res.sendFile(path.join(__dirname, 'public', 'auth.html'));
  return next();
});
app.get('/cached/scripts/redux.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'node_modules', 'redux', 'dist', 'redux.js'));
});
app.get('/cached/scripts/sw-toolbox.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'node_modules', 'sw-toolbox', 'sw-toolbox.js'));
});
app.get('/cached/scripts/moment.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'node_modules', 'moment', 'min', 'moment.min.js'));
});
app.get('/cached/scripts/redux-logger.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'common', 'redux-logger.js'));
});
app.get('/cached/scripts/redux-observer.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'common', 'redux-observer.js'));
});
app.use(express.static('public'));

initApi(app);
subscribeAlarm();
subscribeWatch();

app.listen(process.env.PORT || 8080);
