(() => {
  window.screen.orientation.lock("portrait").catch(err => console.warn(err));

  document.addEventListener("visibilitychange", () => {
    window.AuSu.store.dispatch({
      type: "VISIBILITY_CHANGE",
      visible: document.visibilityState === "visible",
    });
  });
  window.addEventListener("blur", () => {
    window.AuSu.store.dispatch({
      type: "VISIBILITY_CHANGE",
      visible: false,
    });
  });
  window.addEventListener("focus", () => {
    window.AuSu.store.dispatch({
      type: "VISIBILITY_CHANGE",
      visible: true,
    });
  });
  window.AuSu.observeStore(
    window.AuSu.store,
    s => s,
    ({ p, s }) => {
      const pReady = !p ? null : p.ready;
      if (!pReady && s.ready) {
        document.body.classList.add("ready");
      }
    },
  );
  const userContentDiv = document.querySelector("#userContent");
  window.AuSu.observeStore(
    window.AuSu.store,
    s => s,
    ({ s }) => {
      userContentDiv.innerHTML = s.user;
    },
  );

  window.AuSu.alarm.subscribeAlarm();
  window.AuSu.watch.subscribeWatch();
  window.AuSu.vehicules.subscribeVehicules();
  window.AuSu.location.subscribeLocation();

  window.AuSu.alarm.getAlarm();
  window.AuSu.watch.getWatch();
  window.AuSu.location.sendLocation();
  window.AuSu.sw.initSw();
})();
