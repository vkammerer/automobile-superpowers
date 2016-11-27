const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const { initApi } = require('./app/api');

const app = express();
const cookieOptions = { maxAge: 10 * 365 * 24 * 60 * 60 * 1000, httpOnly: true };

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res, next) => {
  if (
    req.body &&
    req.body.user !== process.env.USER_1 &&
    req.body.user !== process.env.USER_2 &&
    req.body.user !== process.env.USER_3 &&
    req.body.user !== process.env.USER_4
  ) return next();
  res.cookie('user', req.body.user, cookieOptions);
  return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.all('*', (req, res, next) => {
  if (
    req.cookies.user !== process.env.USER_1 &&
    req.cookies.user !== process.env.USER_2 &&
    req.cookies.user !== process.env.USER_3 &&
    req.cookies.user !== process.env.USER_4
  ) return res.sendFile(path.join(__dirname, 'public', 'auth.html'));
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
app.use(express.static('public'));

initApi(app);

app.listen(process.env.PORT || 8080);
