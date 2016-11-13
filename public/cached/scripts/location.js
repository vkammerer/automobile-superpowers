(() => {
  const sendLocation = () => {
    const sPromise = window.AuSu.promise.superPromise();
    navigator.geolocation.getCurrentPosition(position => {
      fetch('./api/location', {
        credentials: 'same-origin',
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      }).then(blob => blob.json().then(sPromise.resolve));
    });
    return sPromise.promise;
  };

  window.AuSu.location = {
    sendLocation,
  };
})();
