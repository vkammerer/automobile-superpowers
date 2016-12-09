(() => {
  importScripts('/cached/scripts/sw-toolbox.js');

  toolbox.precache([
    '/',
    '/index.html',
    '/cached/scripts/sw-toolbox.js',
    '/cached/scripts/redux.js',
    '/cached/scripts/moment.js',
    '/cached/scripts/logger.js',
    '/cached/scripts/alarm.js',
    '/cached/scripts/utils.js',
    '/cached/scripts/index.js',
    '/cached/scripts/location.js',
    '/cached/scripts/store.js',
    '/cached/scripts/watch.js',
    '/cached/scripts/sw.js',
    '/cached/scripts/vehicules.js',
  ]);

  toolbox.router.get('/', toolbox.networkFirst);
  toolbox.router.get('/index.html', toolbox.networkFirst);
  toolbox.router.get('/cached/**/*', toolbox.networkFirst);

  function showNotification({ title, body, icon, data }) {
    const options = {
      body,
      icon: icon || './cached/images/icon-192x192.png',
      tag: 'simple-push-demo-notification',
      vibrate: [300, 100, 400, 300, 100, 400],
      data,
      actions: [],
    };
    return self.registration.showNotification(title, options);
  }

  self.addEventListener('push', event => {
    // Retrieve the textual payload from event.data (a PushMessageData object).
    // Other formats are supported (ArrayBuffer, Blob, JSON), check out the documentation
    // on https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData.
    const payload = event.data && event.data.text() ? event.data.text() : 'no payload';
    event.waitUntil(
      showNotification({
        title: 'Automobile SP',
        body: payload,
      })
    );
  });

  self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(clients.matchAll({
      type: 'window',
    }).then(clientList => {
      if (clientList.length > 0) return clientList[0].focus();
      if (clients.openWindow) return clients.openWindow('/');
      return false;
    }));
  });
})();
