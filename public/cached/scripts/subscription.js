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
    window.AuSu.utils.subscribeStore(({ p, s }) => {
      if (p.subscriptionTime !== s.subscriptionTime) updateSubscription();
    });
  };

  const toggleSubscription = () => {
    const s = window.AuSu.store.getState();
    const data = {
      active: !s.subscriptionTime,
      pushAuth: s.pushAuth,
    };
    window.AuSu.utils.post('./api/subscription', data).then(({ time }) =>
      window.AuSu.store.dispatch({
        type: 'SUBSCRIPTION',
        time,
      }));
  };

  document.querySelector('#subscriptionButton').onclick = toggleSubscription;

  const getSubscription = () => {
    window.AuSu.utils.get('./api/subscription').then(({ time }) =>
      window.AuSu.store.dispatch({
        type: 'SUBSCRIPTION',
        time,
      }));
  };

  window.AuSu.subscription = { subscribeSubscription, getSubscription };
})();
