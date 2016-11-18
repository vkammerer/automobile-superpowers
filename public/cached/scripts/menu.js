(() => {
  const updateMenu = () => {
    const s = window.AuSu.store.getState();
    const methodName = s.menuOpen
      ? 'add'
      : 'remove';
    document.body.classList[methodName]('menued');
    if (methodName === 'remove') {
      const menuIframe = document.querySelector('#menuIframe');
      menuIframe.src = '';
      menuIframe.src = 'https://www.reservauto.net/Scripts/Client/Mobile/Menu.asp';
    }
  };

  document.querySelector('#menuButton').onclick = () => {
    window.AuSu.store.dispatch({ type: 'MENU_BUTTON_CLICK' });
  };

  const subscribeMenu = () => {
    window.AuSu.store.subscribe(() => {
      const p = window.AuSu.state;
      const s = window.AuSu.store.getState();
      if (p.menuOpen !== s.menuOpen) updateMenu();
    });
  };

  window.AuSu.menu = { subscribeMenu };
})();
