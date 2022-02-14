(() => {
  const defaultState = {
    user: window.AuSu.utils.getCookie('user'),
    radius: 800,
    watchTime: null,
    ready: false,
    location: null,
    visible: document.visibilityState === 'visible',
    vehicule: null,
    vehicules: [],
  };

  const app = (state = defaultState, action) => {
    switch (action.type) {
      case 'RADIUS':
        return Object.assign({}, state, {
          radius: action.radius,
        });
      case 'VEHICULE':
        return Object.assign({}, state, {
          vehicule: action.vehicule,
        });
      case 'WATCH':
        return Object.assign({}, state, {
          watchTime: action.time,
        });
      case 'LOCATION': {
        return Object.assign({}, state, {
          location: action.location,
          ready: !!(state.ready || state.pushAuth),
        });
      }
      case 'PUSH_AUTH':
        return Object.assign({}, state, {
          pushAuth: action.pushAuth,
          ready: !!(state.ready || state.location),
        });
      case 'VISIBILITY_CHANGE':
        return Object.assign({}, state, {
          visible: action.visible,
        });
      case 'VEHICULES': {
        return Object.assign({}, state, {
          vehicules: action.vehicules,
        });
      }
      default:
        return state;
    }
  };

  let middlewares = [];
  middlewares = window.Redux.applyMiddleware(window.AuSu.logger);
  window.AuSu.store = window.Redux.createStore(app, middlewares);
})();
