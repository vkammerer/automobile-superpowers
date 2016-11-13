(() => {
  const subscriptionContentDiv = document.querySelector('#subscriptionContent');

  const updateSubscriptionTime = () => {
    const timeDiff = 60 - moment().diff(window.AuSu.data.subscription.time, 'minutes');
    if (window.AuSu.data.subscription.timeout)
      clearTimeout(window.AuSu.data.subscription.timeout);
    if (timeDiff > 0) {
      window.AuSu.data.subscription.timeout = setTimeout(updateSubscriptionTime, 60000);
      subscriptionContentDiv.innerHTML = `Still <strong>${timeDiff} minutes</strong>`;
    } else {
      document.body.classList.remove('subscribed');
      subscriptionContentDiv.innerHTML = 'No active subscription';
    }
  };

  const subscribe = () => {
    fetch('./api/subscribe', {
      credentials: 'same-origin',
      method: 'post',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(window.AuSu.data.pushAuth),
    }).then(blob => blob.json().then(subscription => {
      window.AuSu.data.subscription = subscription;
      document.body.classList.add('subscribed');
      updateSubscriptionTime();
    }));
  };

  const unsubscribe = () => {
    fetch('./api/unsubscribe', {
      credentials: 'same-origin',
      method: 'get',
      headers: { 'Content-type': 'application/json' },
    }).then(() => {
      clearTimeout(window.AuSu.data.subscription.timeout);
      window.AuSu.data.subscription = null;
      document.body.classList.remove('subscribed');
      subscriptionContentDiv.innerHTML = 'No active subscription';
    });
  };

  window.AuSu.subscription = {
    subscribe,
    unsubscribe,
  };
})();
