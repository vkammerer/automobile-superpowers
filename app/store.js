const { createStore, applyMiddleware } = require('redux');
const { uniq } = require('lodash');
const { logger } = require('./utils/redux-logger.js');

const defaultUserState = {
  alarmTime: null,
  alarmTimeout: null,
  watchTime: null,
  pushAuth: null,
  vehicule: null,
  notifiedVehicules: [],
};

const usersIds = [
  process.env.USER_1,
  process.env.USER_2,
  process.env.USER_3,
  process.env.USER_4,
];

const users = usersIds.reduce((_users, id) =>
  Object.assign(_users, { [id]: Object.assign({}, defaultUserState, { id }) }),
  {});


const defaultAppState = {
  users,
  vehicules: [],
  lastWatchTime: null,
};

console.log(defaultAppState);

const app = (state = defaultAppState, action) => {
  switch (action.type) {
    case 'PUSH_AUTH':
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          [action.userId]: Object.assign({}, state.users[action.userId], {
            pushAuth: action.pushAuth,
          }),
        }),
      });
    case 'LOCATION': {
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          [action.userId]: Object.assign({}, state.users[action.userId], {
            location: action.location,
          }),
        }),
      });
    }
    case 'VEHICULES': {
      return Object.assign({}, state, {
        vehicules: action.vehicules,
      });
    }
    case 'VEHICULE':
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          [action.userId]: Object.assign({}, state.users[action.userId], {
            vehicule: (
              action.vehicule &&
              state.users[action.userId].vehicule &&
              state.users[action.userId].vehicule.Name === action.vehicule.Name
            ) ? null : action.vehicule,
          }),
        }),
      });
    case 'ALARM_TIME':
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          [action.userId]: Object.assign({}, state.users[action.userId], {
            alarmTime: action.time,
          }),
        }),
      });
    case 'ALARM_TIMEOUT':
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          [action.userId]: Object.assign({}, state.users[action.userId], {
            alarmTimeout: action.timeout,
          }),
        }),
      });
    case 'WATCH_TIME':
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          [action.userId]: Object.assign({}, state.users[action.userId], {
            watchTime: action.time,
          }),
        }),
        watchTime: action.time,
      });
    case 'VEHICULE_NOTIFICATION':
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          [action.userId]: Object.assign({}, state.users[action.userId], {
            notifiedVehicules: uniq(
              [...state.users[action.userId].notifiedVehicules, action.vehiculeId]
            ),
          }),
        }),
      });
    default:
      return state;
  }
};

const middlewares = process.env.NODE_ENV === 'production'
  ? null
  : applyMiddleware(logger);

const store = createStore(app, middlewares);
if (process.env.NODE_ENV !== 'production') {
  global.store = store;
}

const subscribeStore = cb => {
  let state = store.getState();
  store.subscribe(() => {
    const s = store.getState();
    cb({
      p: state,
      s,
    });
    state = s;
  });
};

module.exports = { store, subscribeStore };
