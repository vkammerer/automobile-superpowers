(() => {
  document.addEventListener('visibilitychange', () => {
    window.AuSu.store.dispatch({
      type: 'VISIBILITY_CHANGE',
      visible: document.visibilityState === 'visible',
    });
  });
  window.AuSu.store.subscribe(() => {
    const p = window.AuSu.state;
    const s = window.AuSu.store.getState();
    if (!p.ready && s.ready) {
      document.body.classList.add('ready');
    }
  });

  window.AuSu.alarm.subscribeAlarm();
  window.AuSu.super.subscribeSuper();
  window.AuSu.menu.subscribeMenu();
  window.AuSu.subscription.subscribeSubscription();
  window.AuSu.vehicules.subscribeVehicules();

  // Redux logger
  window.AuSu.store.subscribe(() => {
    const p = window.AuSu.state;
    const s = window.AuSu.store.getState();
    console.log({ p, s });
    window.AuSu.state = s;
  });

  window.AuSu.alarm.getAlarm();
  window.AuSu.subscription.getSubscription();
  window.AuSu.location.sendLocation();
  window.AuSu.sw.initSw();
})();
