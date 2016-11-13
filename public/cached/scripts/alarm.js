(() => {
  const ALARM_DURATION_MINUTES = 29;
  const alarmContentDiv = document.querySelector('#alarmContent');

  const updateAlarmTime = () => {
    const timeDiff = ALARM_DURATION_MINUTES - moment().diff(window.AuSu.data.alarm.time, 'minutes');
    if (window.AuSu.data.alarm.timeout)
      clearTimeout(window.AuSu.data.alarm.timeout);
    if (timeDiff > 0) {
      window.AuSu.data.alarm.timeout = setTimeout(updateAlarmTime, 60000);
      alarmContentDiv.innerHTML = `Still <strong>${timeDiff} minutes</strong>`;
    } else {
      document.body.classList.remove('alarmed');
      alarmContentDiv.innerHTML = 'No active alarm';
    }
  };

  const setAlarm = () => {
    const data = {
      type: 'alarm',
      timer: ALARM_DURATION_MINUTES,
    };
    navigator.serviceWorker.controller.postMessage(JSON.stringify(data));
    window.AuSu.data.alarm = { time: new Date() };
    document.body.classList.add('alarmed');
    updateAlarmTime();
  };

  const unsetAlarm = () => {
    const data = {
      type: 'unalarm',
    };
    navigator.serviceWorker.controller.postMessage(JSON.stringify(data));
    clearTimeout(window.AuSu.data.alarm.timeout);
    window.AuSu.data.alarm = null;
    document.body.classList.remove('alarmed');
    alarmContentDiv.innerHTML = 'No active alarm';
  };

  window.AuSu.alarm = {
    setAlarm,
    unsetAlarm,
  };
})();
