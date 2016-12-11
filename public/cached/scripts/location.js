(() => {
  const sendLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const data = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      window.AuSu.utils.post('./api/location', data).then(location =>
        window.AuSu.store.dispatch({ type: 'LOCATION', location }));
    });
  };

  const subscribeLocation = () => {
    window.AuSu.observeStore(window.AuSu.store, s => s, ({ p, s }) => {
      if (!p.visible && s.visible) sendLocation();
    });
  };

  window.AuSu.location = {
    sendLocation,
    subscribeLocation,
  };
})();
