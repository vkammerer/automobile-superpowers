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
      : 'No alarm';
    alarmContentDiv.innerHTML = innerHTML;
    document.body.classList[methodName]('alarmed');
    if (timeout) clearTimeout(timeout);
    if (timeDiff > 0) timeout = setTimeout(updateAlarm, 60000);
  };

  const subscribeAlarm = () => {
    window.AuSu.observeStore(window.AuSu.store, s => s, ({ p, s }) => {
      const pAlarmTime = !p ? null : p.alarmTime;
      const pVisible = !p ? null : p.visible;
      if (pAlarmTime !== s.alarmTime || (!pVisible && s.visible)) updateAlarm();
    });
  };

  const toggleAlarm = () => {
    const s = window.AuSu.store.getState();
    const data = {
      active: !s.alarmTime,
      pushAuth: s.pushAuth,
    };
    window.AuSu.utils.post('./api/alarm', data).then(({ time }) =>
      window.AuSu.store.dispatch({
        type: 'ALARM',
        time,
      }));
  };

  document.querySelector('#alarmButton').onclick = toggleAlarm;

  const getAlarm = () => {
    window.AuSu.utils.get('./api/alarm').then(({ time }) =>
      window.AuSu.store.dispatch({
        type: 'ALARM',
        time,
      }));
  };

  window.AuSu.alarm = { subscribeAlarm, getAlarm };
})();
