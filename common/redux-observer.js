function observeStore(store, select, onChange) {
  let currentState = null;

  function handleChange() {
    const nextState = select(store.getState());
    if (nextState !== currentState) {
      onChange({ p: currentState, s: nextState });
      currentState = nextState;
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}

try {
  module.exports = { observeStore };
} catch (err) {
  window.AuSu.observeStore = observeStore;
}

