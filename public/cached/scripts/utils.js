(() => {
  const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
  };

  const get = url => new Promise((resolve, reject) => {
    fetch(url, {
      credentials: 'same-origin',
      method: 'get',
      headers: { 'Content-type': 'application/json' },
    }).then(blob => blob.json().then(resolve, reject));
  });

  const post = (url, data) => new Promise((resolve, reject) => {
    fetch(url, {
      credentials: 'same-origin',
      method: 'post',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(data),
    }).then(blob => blob.json().then(resolve, reject));
  });

  const subscribeStore = cb => {
    window.AuSu.store.subscribe(() => {
      const p = window.AuSu.state;
      const s = window.AuSu.store.getState();
      cb({ p, s });
    });
  };

  window.AuSu.utils = { urlBase64ToUint8Array, get, post, subscribeStore };
})();
