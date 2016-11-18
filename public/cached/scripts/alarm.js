(() => {
  const ALARM_DURATION_MINUTES = 29;
  const alarmContentDiv = document.querySelector('#alarmContent');

  let timeout;

  const updateAlarm = () => {
    const s = window.AuSu.store.getState();
    const methodName = s.alarmTime
      ? 'add'
      : 'remove';
    const timeDiff = !s.alarmTime
      ? null
      : ALARM_DURATION_MINUTES - moment().diff(s.alarmTime, 'minutes');
    const innerHTML = s.alarmTime
      ? `Still <strong>${timeDiff} minutes</strong>`
      : 'No active alarm';
    alarmContentDiv.innerHTML = innerHTML;
    document.body.classList[methodName]('alarmed');
    if (timeout) clearTimeout(timeout);
    if (timeDiff > 0) timeout = setTimeout(updateAlarm, 60000);
  };

  const subscribeAlarm = () => {
    window.AuSu.store.subscribe(() => {
      const p = window.AuSu.state;
      const s = window.AuSu.store.getState();
      if (p.alarmTime !== s.alarmTime) updateAlarm();
    });
  };

  document.querySelector('#alarmButton').onclick = () => {
    const s = window.AuSu.store.getState();
    fetch('./api/alarm', {
      credentials: 'same-origin',
      method: 'post',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        active: !s.alarmTime,
        pushAuth: s.pushAuth,
      }),
    }).then(blob => blob.json().then(({ time }) => {
      window.AuSu.store.dispatch({
        type: 'ALARM',
        time,
      });
    }));
  };

  const getAlarm = () => {
    fetch('./api/alarm', {
      credentials: 'same-origin',
      method: 'get',
      headers: { 'Content-type': 'application/json' },
    }).then(blob => blob.json().then(({ time }) => {
      window.AuSu.store.dispatch({
        type: 'ALARM',
        time,
      });
    }));
  };

  window.AuSu.alarm = { subscribeAlarm, getAlarm };
})();
