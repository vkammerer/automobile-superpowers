function observeStore(store, select, onChange) {
  let currentState = null;

  function handleChange() {
    const nextState = select(store.getState());
    if (nextState !== currentState) {
      if (currentState) onChange({ p: currentState, s: nextState });
      currentState = nextState;
    }
  }
  return store.subscribe(handleChange);
}

try {
  module.exports = { observeStore };
} catch (err) {
  window.AuSu.observeStore = observeStore;
}

