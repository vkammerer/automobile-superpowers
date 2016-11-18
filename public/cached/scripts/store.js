(() => {
  const defaultState = {
    alarmTime: null,
    subscriptionTime: null,
    ready: false,
    menuOpen: false,
    superOpen: false,
    location: null,
    visible: document.visibilityState === 'visible',
    vehicules: [],
  };

  const app = (state = defaultState, action) => {
    console.log(action);
    switch (action.type) {
      case 'ALARM':
        return Object.assign({}, state, {
          alarmTime: action.time,
        });
      case 'SUBSCRIPTION':
        return Object.assign({}, state, {
          subscriptionTime: action.time,
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
      case 'SUPER_BUTTON_CLICK':
        return Object.assign({}, state, {
          superOpen: !state.superOpen,
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

  window.AuSu.store = window.Redux.createStore(app);
  window.AuSu.state = window.AuSu.store.getState();
})();
