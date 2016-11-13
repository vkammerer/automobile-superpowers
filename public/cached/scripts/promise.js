(() => {
  const superPromise = () => {
    const sPromise = {};
    sPromise.promise = new Promise((resolve, reject) => {
      Object.assign(sPromise, { resolve, reject });
    });
    return sPromise;
  };

  window.AuSu.promise = {
    superPromise,
  };
})();
