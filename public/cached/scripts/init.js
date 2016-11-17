(() => {
  document.addEventListener('visibilitychange', () => {
    window.AuSu.store.dispatch({
      type: 'VISIBILITY_CHANGE',
      visible: document.visibilityState === 'visible',
    });
  });
  window.AuSu.store.subscribe(() => {
    const p = window.AuSu.state;
    if (!p) return;
    const s = window.AuSu.store.getState();
    if (!p.mainnn.ready && s.mainnn.ready) {
      document.body.classList.add('ready');
    }
  });
  // Redux logger
  window.AuSu.store.subscribe(() => {
    const p = window.AuSu.state;
    const s = window.AuSu.store.getState();
    console.log(p);
    console.log(s);
    window.AuSu.state = s;
  });
  window.AuSu.location.sendLocation();
  window.AuSu.sw.initSw();
  window.AuSu.alarmmm.getAlarm();
  window.AuSu.subscriptionnn.getSubscription();
})();
