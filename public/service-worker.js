importScripts('/cached/scripts/sw-toolbox.js');
toolbox.precache(['/', '/index.html', '/cached/scripts/index.js']);
toolbox.router.get('/', toolbox.networkFirst);
toolbox.router.get('/index.html', toolbox.networkFirst);
toolbox.router.get('/cached/**/*', toolbox.networkFirst);

// Register event listener for the 'push' event.
self.addEventListener('push', (event) => {
  // Retrieve the textual payload from event.data (a PushMessageData object).
  // Other formats are supported (ArrayBuffer, Blob, JSON), check out the documentation
  // on https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData.
  const payload = event.data ? event.data.text() : 'no payload';

  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    self.registration.showNotification('Automobile Superpowers', {
      body: payload,
    })
  );
});
