(() => {
  const subscriptionContentDiv = document.querySelector('#subscriptionContent');
  const SUBSCRIPTION_DURATION_MINUTES = 59;

  let timeout;

  const updateSubscription = () => {
    const s = window.AuSu.store.getState();
    const methodName = s.subscriptionTime
      ? 'add'
      : 'remove';
    const timeDiff = !s.subscriptionTime
      ? null
      : SUBSCRIPTION_DURATION_MINUTES - moment().diff(s.subscriptionTime, 'minutes');
    const innerHTML = s.subscriptionTime
      ? `Still <strong>${timeDiff} minutes</strong>`
      : 'No active subscription';
    subscriptionContentDiv.innerHTML = innerHTML;
    document.body.classList[methodName]('subscribed');
    if (timeout) clearTimeout(timeout);
    if (timeDiff > 0) timeout = setTimeout(updateSubscription, 60000);
  };

  const subscribeSubscription = () => {
    window.AuSu.store.subscribe(() => {
      const p = window.AuSu.state;
      const s = window.AuSu.store.getState();
      if (p.subscriptionTime !== s.subscriptionTime) updateSubscription();
    });
  };

  document.querySelector('#subscriptionButton').onclick = () => {
    const s = window.AuSu.store.getState();
    fetch('./api/subscription', {
      credentials: 'same-origin',
      method: 'post',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        active: !s.subscriptionTime,
        pushAuth: s.pushAuth,
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

  window.AuSu.subscription = { subscribeSubscription, getSubscription };
})();
