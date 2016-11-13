(() => {
  const vapidPublicKey = 'BHn6LqYpEGcBEeGpJpoS-_mxqNUX5G6MUAP-ZgXu2FxSVLKXpZN01iJrFwIJ7koyrJ53sg-FHhM-erj1BOfub8I';

  const initSw = () => {
    const sPromise = window.AuSu.promise.superPromise();
    navigator.serviceWorker.register('/service-worker.js');
    navigator.serviceWorker.ready
      .then(registration => registration.pushManager.getSubscription()
      .then(subscription => {
        // If a subscription was found, return it.
        if (subscription) return subscription;

        // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
        // send notifications that don't have a visible effect for the user).
        const convertedVapidKey = window.AuSu.conversion.urlBase64ToUint8Array(vapidPublicKey);

        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
      }))
      .then(subscription => {
        // Retrieve the user's public key.
        const rawKey = subscription.getKey
          ? subscription.getKey('p256dh')
          : '';
        const key = rawKey
          ? btoa(String.fromCharCode(...new Uint8Array(rawKey)))
          : '';
        const rawAuthSecret = subscription.getKey
          ? subscription.getKey('auth')
          : '';
        const authSecret = rawAuthSecret
          ? btoa(String.fromCharCode(...new Uint8Array(rawAuthSecret)))
          : '';
        sPromise.resolve({
          endpoint: subscription.endpoint,
          key,
          authSecret,
        });
      });
    return sPromise.promise;
  };

  window.AuSu.sw = {
    initSw,
  };
})();
