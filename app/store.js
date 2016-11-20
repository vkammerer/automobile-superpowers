const { createStore } = require('redux');
const { users } = require('./users');

const defaultState = {
  users,
  vehicules: [],
};

const app = (state = defaultState, action) => {
  switch (action.type) {
    case 'PUSH_AUTH':
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          [action.userId]: Object.assign({}, state.users[action.userId], {
            pushAuth: action.pushAuth,
          }),
        }),
      });
    case 'ALARM':
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          [action.userId]: Object.assign({}, state.users[action.userId], {
            alarmTime: action.time,
            alarmTimeout: action.timeout,
          }),
        }),
      });
    case 'VEHICULE':
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          [action.userId]: Object.assign({}, state.users[action.userId], {
            vehicule: (
              state.users[action.userId].vehicule &&
              action.vehicule &&
              state.users[action.userId].vehicule.Name === action.vehicule.Name
            ) ? null : action.vehicule,
          }),
        }),
      });
    case 'WATCH':
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          [action.userId]: Object.assign({}, state.users[action.userId], {
            watchTime: action.time,
          }),
        }),
      });
    case 'WATCH_TIMEOUT':
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          [action.userId]: Object.assign({}, state.users[action.userId], {
            watchTimeout: action.timeout,
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
        users: Object.assign({}, state.users, {
          [action.userId]: Object.assign({}, state.users[action.userId], {
            vehicules: action.vehicules,
          }),
        }),
      });
    }
    default:
      return state;
  }
};

const store = createStore(app);
let state = store.getState();

const subscribeStore = cb => {
  store.subscribe(() => {
    const s = window.AuSu.store.getState();
    cb({
      p: state,
      s,
    });
    state = s;
  });
};

module.exports = { store, subscribeStore };
