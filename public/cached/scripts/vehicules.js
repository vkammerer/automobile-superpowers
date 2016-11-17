(() => {
  const vehiculesContentDiv = document.querySelector('#vehiculesContent');

  const updateVehicules = () => {
    const s = window.AuSu.store.getState();
    const vehiculesHTML = s.mainnn.vehicules
      .map(v => {
        const distance = Math.floor(v.distance * 100000);
        const number = v.vehicule.Name;
        const energy = v.vehicule.EnergyLevel;
        const className = v.vehicule.ModelName === 'LEAF' ? 'vehiculeLeaf' : 'vehiculePrius';
        return `
          <div class="vehicule ${className}">
            <div class="vehiculeDistance">
              ${distance}m
            </div>
            <div class="vehiculeEnergy">
              ${energy}%
            </div>
            <div class="vehiculeId">
              ${number}
            </div>
          </div>
        `;
      })
      .join('');
    vehiculesContentDiv.innerHTML = vehiculesHTML;
  };

  const getVehicules = () => {
    fetch('./api/vehicules', {
      credentials: 'same-origin',
      method: 'get',
      headers: { 'Content-type': 'application/json' },
    }).then(blob => blob.json().then(vehicules => {
      window.AuSu.store.dispatch({
        type: 'VEHICULES',
        vehicules: vehicules.slice(0, 5),
      });
    }));
  };

  window.AuSu.store.subscribe(() => {
    const p = window.AuSu.state;
    if (!p) return;
    const s = window.AuSu.store.getState();
    if (!p.mainnn.visible && s.mainnn.visible) getVehicules();
    if (!p.mainnn.menuOpen && s.mainnn.menuOpen) getVehicules();
    if (p.mainnn.vehicules !== s.mainnn.vehicules) updateVehicules();
  });
})();
