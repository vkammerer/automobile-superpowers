(() => {
  const alarmmmDefaultState = {
    time: null,
  };

  const subscriptionnnDefaultState = {
    time: null,
  };

  const mainnnDefaultState = {
    ready: false,
    menuOpen: false,
    location: null,
    visible: document.visibilityState === 'visible',
    vehicules: [],
  };
  const alarmmm = (state = alarmmmDefaultState, action) => {
    switch (action.type) {
      case 'ALARM':
        return Object.assign({}, state, {
          time: action.time,
        });
      default:
        return state;
    }
  };
  const subscriptionnn = (state = subscriptionnnDefaultState, action) => {
    switch (action.type) {
      case 'SUBSCRIPTION':
        return Object.assign({}, state, {
          time: action.time,
        });
      default:
        return state;
    }
  };
  const mainnn = (state = mainnnDefaultState, action) => {
    console.log(action);
    switch (action.type) {
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
      case 'MENU_BUTTON_CLICK':
        return Object.assign({}, state, {
          menuOpen: !state.menuOpen,
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
  const app = window.Redux.combineReducers({
    alarmmm,
    subscriptionnn,
    mainnn,
  });

  window.AuSu.store = window.Redux.createStore(app);
  window.AuSu.state = window.AuSu.store.getState();
})();
