(() => {
  const locationPromise = window.AuSu.location.sendLocation().then(location => {
    window.AuSu.data.location = location;
  });
  const pushPromise = window.AuSu.sw.initSw().then(pushAuth => {
    window.AuSu.data.pushAuth = pushAuth;
  });
  Promise.all([locationPromise, pushPromise]).then(() => {
    document.querySelector('#refreshButton').onclick = window.AuSu.refresh.refreshIframe;
    document.querySelector('#alarmButton').onclick = window.AuSu.alarm.setAlarm;
    document.querySelector('#unalarmButton').onclick = window.AuSu.alarm.unsetAlarm;
    document.querySelector('#subscriptionButton').onclick = window.AuSu.subscription.subscribe;
    document.querySelector('#unsubscriptionButton').onclick = window.AuSu.subscription.unsubscribe;
    document.querySelector('#menuButton').onclick = window.AuSu.menu.toggleMenu;
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') window.AuSu.vehicules.getVehicules();
    });
    document.body.classList.add('ready');
  });
})();
