(() => {
  const ALARM_DURATION_MINUTES = 29;
  const alarmContentDiv = document.querySelector('#alarmContent');

  let timeout;

  const updateAlarm = () => {
    const s = window.AuSu.store.getState();
    const methodName = s.alarmmm.time
      ? 'add'
      : 'remove';
    const timeDiff = !s.alarmmm.time
      ? null
      : ALARM_DURATION_MINUTES - moment().diff(s.alarmmm.time, 'minutes');
    const innerHTML = s.alarmmm.time
      ? `Still <strong>${timeDiff} minutes</strong>`
      : 'No active alarm';
    alarmContentDiv.innerHTML = innerHTML;
    document.body.classList[methodName]('alarmed');
    if (timeout) clearTimeout(timeout);
    if (timeDiff > 0) timeout = setTimeout(updateAlarm, 60000);
  };

  document.querySelector('#alarmButton').onclick = () => {
    const s = window.AuSu.store.getState();
    fetch('./api/alarm', {
      credentials: 'same-origin',
      method: 'post',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        active: !s.alarmmm.time,
        pushAuth: s.mainnn.pushAuth,
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

  window.AuSu.store.subscribe(() => {
    const p = window.AuSu.state;
    if (!p) return;
    const s = window.AuSu.store.getState();
    if (p.alarmmm.time !== s.alarmmm.time) updateAlarm();
  });

  window.AuSu.alarmmm = { getAlarm };
})();
