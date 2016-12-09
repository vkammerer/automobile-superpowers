const logger = ({ getState }) => next => action => {
  if (!console) {
    return next(action);
  }
  const prevState = getState();
  const actionDisplay = action;
  const returnValue = next(action);
  const nextState = getState();
  const time = new Date();
  const message = `action ${action.type} @ ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

  console.groupCollapsed(message);
  console.log('Previous state:', prevState);
  console.log('Action:', actionDisplay);
  console.log('Next state:', nextState);
  console.groupEnd();

  return returnValue;
};

try {
  module.exports = { logger };
} catch (err) {
  window.AuSu.logger = logger;
}

