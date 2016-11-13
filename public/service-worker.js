(() => {
  const superPromise = () => {
    const sPromise = {};
    sPromise.promise = new Promise((resolve, reject) => {
      Object.assign(sPromise, { resolve, reject });
    });
    return sPromise;
  };

  importScripts('/cached/scripts/sw-toolbox.js');

  toolbox.precache([
    '/',
    '/index.html',
    '/cached/scripts/moment.js',
    '/cached/scripts/conversion.js',
    '/cached/scripts/promise.js',
    '/cached/scripts/sw.js',
    '/cached/scripts/location.js',
    '/cached/scripts/alarm.js',
    '/cached/scripts/menu.js',
    '/cached/scripts/refresh.js',
    '/cached/scripts/subscription.js',
    '/cached/scripts/vehicules.js',
    '/cached/scripts/index.js',
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

  // Register event listener for the 'push' event.
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

  const AuSu = { data: {} };

  self.addEventListener('message', event => {
    const data = JSON.parse(event.data);
    const sPromise = superPromise();
    if (data.type === 'alarm') {
      AuSu.data.timer = setTimeout(() => {
        showNotification({
          title: 'Automobile SP',
          body: `Alarm set ${data.timer} minutes ago`,
        }).then(sPromise.resolve);
      }, data.timer * 60000);
      event.waitUntil(sPromise.promise);
    }
    if (data.type === 'unalarm') clearTimeout(AuSu.data.timer);
  });
})();
