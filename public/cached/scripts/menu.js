(() => {
  const toggleMenu = () => {
    const s = window.AuSu.store.getState();
    const methodName = s.mainnn.menuOpen
      ? 'add'
      : 'remove';
    document.body.classList[methodName]('menued');
  };

  document.querySelector('#menuButton').onclick = () => {
    window.AuSu.store.dispatch({ type: 'MENU_BUTTON_CLICK' });
  };

  window.AuSu.store.subscribe(() => {
    const p = window.AuSu.state;
    if (!p) return;
    const s = window.AuSu.store.getState();
    if (p.mainnn.menuOpen !== s.mainnn.menuOpen) toggleMenu();
  });
})();
