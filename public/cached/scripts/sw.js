(() => {
  const vapidPublicKey = 'BHn6LqYpEGcBEeGpJpoS-_mxqNUX5G6MUAP-ZgXu2FxSVLKXpZN01iJrFwIJ7koyrJ53sg-FHhM-erj1BOfub8I';
  const applicationServerKey = window.AuSu.utils.urlBase64ToUint8Array(vapidPublicKey);

  const initSw = () => {
    navigator.serviceWorker.register('/service-worker.js');
    navigator.serviceWorker.ready
      .then(registration => registration.pushManager.getSubscription()
      .then(watch => {
        if (watch) return watch;
        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        });
      }))
      .then(watch => {
        const rawP256dh = watch.getKey
          ? watch.getKey('p256dh')
          : '';
        const p256dh = rawP256dh
          ? btoa(String.fromCharCode(...new Uint8Array(rawP256dh)))
          : '';
        const rawAuth = watch.getKey
          ? watch.getKey('auth')
          : '';
        const auth = rawAuth
          ? btoa(String.fromCharCode(...new Uint8Array(rawAuth)))
          : '';
        window.AuSu.store.dispatch({
          type: 'PUSH_AUTH',
          pushAuth: {
            endpoint: watch.endpoint,
            keys: {
              p256dh,
              auth,
            },
          },
        });
      });
  };

  window.AuSu.sw = { initSw };
})();
