(() => {
  const radiusContentDiv = document.querySelector('#radiusContent span');

  const updateRadius = () => {
    const s = window.AuSu.store.getState();
    radiusContentDiv.innerHTML = `${s.radius}m`;
  };

  const subscribeRadius = () => {
    window.AuSu.observeStore(window.AuSu.store, s => s, ({ p, s }) => {
      const pRadius = !p ? null : p.radius;
      console.log(p, s);
      if (pRadius !== s.radius) updateRadius();
    });
  };

  const onRadiusChange = (e) => {
    console.log(e.target.value);
    const s = window.AuSu.store.getState();
    const data = {
      radius: e.target.value,
      pushAuth: s.pushAuth,
    };
    window.AuSu.utils.post('./api/radius', data).then(({ radius }) =>
      window.AuSu.store.dispatch({
        type: 'RADIUS',
        radius,
      }));
  };

  document.querySelector('#radiusInput').onchange = onRadiusChange;

  const getRadius = () => {
    window.AuSu.utils.get('./api/radius').then(({ radius }) =>
      window.AuSu.store.dispatch({
        type: 'RADIUS',
        radius,
      }));
  };

  window.AuSu.radius = { subscribeRadius, getRadius };
})();
