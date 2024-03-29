(() => {
  const WATCH_DURATION_MINUTES = 59;
  const watchContentDiv = document.querySelector('#watchContent');

  let timeout;

  const updateWatch = () => {
    const s = window.AuSu.store.getState();
    const methodName = s.watchTime
      ? 'add'
      : 'remove';
    const timeDiff = !s.watchTime
      ? null
      : WATCH_DURATION_MINUTES - moment().diff(s.watchTime, 'minutes');
    const innerHTML = s.watchTime
      ? `Still <strong>${timeDiff} minutes</strong>`
      : 'No active watch';
    watchContentDiv.innerHTML = innerHTML;
    document.body.classList[methodName]('watched');
    if (timeout) clearTimeout(timeout);
    if (timeDiff > 0) timeout = setTimeout(updateWatch, 60000);
  };

  const subscribeWatch = () => {
    window.AuSu.observeStore(window.AuSu.store, s => s, ({ p, s }) => {
      const pWatchTime = !p ? null : p.watchTime;
      const pVisible = !p ? null : p.visible;
      if (pWatchTime !== s.watchTime || (!pVisible && s.visible)) updateWatch();
    });
  };

  const toggleWatch = () => {
    const s = window.AuSu.store.getState();
    const data = {
      active: !s.watchTime,
      pushAuth: s.pushAuth,
    };
    window.AuSu.utils.post('./api/watch', data).then(({ time }) =>
      window.AuSu.store.dispatch({
        type: 'WATCH',
        time,
      }));
  };

  document.querySelector('#watchButton').onclick = toggleWatch;

  const getWatch = () => {
    window.AuSu.utils.get('./api/watch').then(({ time }) =>
      window.AuSu.store.dispatch({
        type: 'WATCH',
        time,
      }));
  };

  window.AuSu.watch = { subscribeWatch, getWatch };
})();
