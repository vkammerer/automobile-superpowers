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
  window.AuSu.subscription.subscribeSubscription();
  window.AuSu.vehicules.subscribeVehicules();

  // Redux logger
  window.AuSu.utils.subscribeStore(({ p, s }) => {
    console.log({ p, s });
    window.AuSu.state = s;
  });

  window.AuSu.alarm.getAlarm();
  window.AuSu.subscription.getSubscription();
  window.AuSu.vehicules.getVehicules();
  window.AuSu.location.sendLocation();
  window.AuSu.sw.initSw();
})();
