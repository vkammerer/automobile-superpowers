const defaultValues = {
  alarmTime: null,
  subscriptionTime: null,
  vehicules: [],
};
const users = {};

[
  process.env.USER_1,
  process.env.USER_2,
  process.env.USER_3,
  process.env.USER_4,
].forEach(id => (users[id] = Object.assign({}, defaultValues, { id })));

module.exports = { users };
