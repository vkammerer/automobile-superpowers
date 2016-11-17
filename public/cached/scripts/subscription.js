(() => {
  const subscriptionContentDiv = document.querySelector('#subscriptionContent');
  const SUBSCRIPTION_DURATION_MINUTES = 59;

  let timeout;

  const updateSubscription = () => {
    const s = window.AuSu.store.getState();
    const methodName = s.subscriptionnn.time
      ? 'add'
      : 'remove';
    const timeDiff = !s.subscriptionnn.time
      ? null
      : SUBSCRIPTION_DURATION_MINUTES - moment().diff(s.subscriptionnn.time, 'minutes');
    const innerHTML = s.subscriptionnn.time
      ? `Still <strong>${timeDiff} minutes</strong>`
      : 'No active subscription';
    subscriptionContentDiv.innerHTML = innerHTML;
    document.body.classList[methodName]('subscribed');
    if (timeout) clearTimeout(timeout);
    if (timeDiff > 0) timeout = setTimeout(updateSubscription, 60000);
  };

  document.querySelector('#subscriptionButton').onclick = () => {
    const s = window.AuSu.store.getState();
    fetch('./api/subscription', {
      credentials: 'same-origin',
      method: 'post',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        active: !s.subscriptionnn.time,
        pushAuth: s.mainnn.pushAuth,
      }),
    }).then(blob => blob.json().then(({ time }) => {
      window.AuSu.store.dispatch({
        type: 'SUBSCRIPTION',
        time,
      });
    }));
  };

  const getSubscription = () => {
    fetch('./api/subscription', {
      credentials: 'same-origin',
      method: 'get',
      headers: { 'Content-type': 'application/json' },
    }).then(blob => blob.json().then(({ time }) => {
      window.AuSu.store.dispatch({
        type: 'SUBSCRIPTION',
        time,
      });
    }));
  };

  window.AuSu.store.subscribe(() => {
    const p = window.AuSu.state;
    if (!p) return;
    const s = window.AuSu.store.getState();
    if (p.subscriptionnn.time !== s.subscriptionnn.time) updateSubscription();
  });

  window.AuSu.subscriptionnn = { getSubscription };
})();
