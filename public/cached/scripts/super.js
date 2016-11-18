(() => {
  const updateSuper = () => {
    const s = window.AuSu.store.getState();
    const methodName = s.superOpen
      ? 'add'
      : 'remove';
    document.body.classList[methodName]('supered');
  };

  document.querySelector('#superButton').onclick = () => {
    window.AuSu.store.dispatch({ type: 'SUPER_BUTTON_CLICK' });
  };

  const subscribeSuper = () => {
    window.AuSu.store.subscribe(() => {
      const p = window.AuSu.state;
      const s = window.AuSu.store.getState();
      if (p.superOpen !== s.superOpen) updateSuper();
    });
  };

  window.AuSu.super = { subscribeSuper };
})();
