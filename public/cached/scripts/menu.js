(() => {
  const toggleMenu = () => {
    const methodName = document.body.classList.contains('menued')
      ? 'remove'
      : 'add';
    document.body.classList[methodName]('menued');
    if (methodName === 'add') window.AuSu.vehicules.getVehicules();
  };

  window.AuSu.menu = {
    toggleMenu,
  };
})();
