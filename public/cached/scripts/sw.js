(() => {
  const vapidPublicKey = 'BHn6LqYpEGcBEeGpJpoS-_mxqNUX5G6MUAP-ZgXu2FxSVLKXpZN01iJrFwIJ7koyrJ53sg-FHhM-erj1BOfub8I';
  const applicationServerKey = window.AuSu.conversion.urlBase64ToUint8Array(vapidPublicKey);

  const initSw = () => {
    navigator.serviceWorker.register('/service-worker.js');
    navigator.serviceWorker.ready
      .then(registration => registration.pushManager.getSubscription()
      .then(subscription => {
        if (subscription) return subscription;
        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        });
      }))
      .then(subscription => {
        const rawP256dh = subscription.getKey
          ? subscription.getKey('p256dh')
          : '';
        const p256dh = rawP256dh
          ? btoa(String.fromCharCode(...new Uint8Array(rawP256dh)))
          : '';
        const rawAuth = subscription.getKey
          ? subscription.getKey('auth')
          : '';
        const auth = rawAuth
          ? btoa(String.fromCharCode(...new Uint8Array(rawAuth)))
          : '';
        window.AuSu.store.dispatch({
          type: 'PUSH_AUTH',
          pushAuth: {
            endpoint: subscription.endpoint,
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
