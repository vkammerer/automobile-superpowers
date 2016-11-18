(() => {
  const sendLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      fetch('./api/location', {
        credentials: 'same-origin',
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      }).then(blob => blob.json().then(location => {
        window.AuSu.store.dispatch({ type: 'LOCATION', location });
      }));
    });
  };

  window.AuSu.location = { sendLocation };
})();
