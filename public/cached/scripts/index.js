(() => {
  document.addEventListener('visibilitychange', () => {
    window.AuSu.store.dispatch({
      type: 'VISIBILITY_CHANGE',
      visible: document.visibilityState === 'visible',
    });
  });
  window.AuSu.utils.subscribeStore(({ p, s }) => {
    if (!p.ready && s.ready) {
      document.body.classList.add('ready');
    }
  });

  window.AuSu.alarm.subscribeAlarm();
  window.AuSu.watch.subscribeWatch();
  window.AuSu.vehicules.subscribeVehicules();
  window.AuSu.location.subscribeLocation();

  // Enables Redux state diff
  window.AuSu.utils.subscribeStore(({ s }) => {
    window.AuSu.state = s;
  });

  window.AuSu.alarm.getAlarm();
  window.AuSu.watch.getWatch();
  window.AuSu.location.sendLocation();
  window.AuSu.sw.initSw();
})();
