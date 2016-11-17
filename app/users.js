const users = {
  [process.env.USER_1]: {
    id: process.env.USER_1,
    alarmmm: {},
    subscriptionnn: {},
    vehicules: { data: [] },
  },
  [process.env.USER_2]: {
    id: process.env.USER_2,
    alarmmm: {},
    subscriptionnn: {},
    vehicules: { data: [] },
  },
};

module.exports = { users };
