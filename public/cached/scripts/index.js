(() => {
  document.addEventListener('visibilitychange', () => {
    window.AuSu.store.dispatch({
      type: 'VISIBILITY_CHANGE',
      visible: document.visibilityState === 'visible',
    });
  });
  window.AuSu.observeStore(window.AuSu.store, s => s, ({ p, s }) => {
    const pReady = !p ? null : p.ready;
    if (!pReady && s.ready) {
      document.body.classList.add('ready');
    }
  });

  window.AuSu.alarm.subscribeAlarm();
  window.AuSu.watch.subscribeWatch();
  window.AuSu.vehicules.subscribeVehicules();
  window.AuSu.location.subscribeLocation();

  window.AuSu.alarm.getAlarm();
  window.AuSu.watch.getWatch();
  window.AuSu.sw.initSw();
})();
