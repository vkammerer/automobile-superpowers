(() => {
  const vehiculesContentDiv = document.querySelector('#vehiculesContent');

  const updateVehicules = () => {
    const s = window.AuSu.store.getState();
    const vehiculesHTML = s.vehicules
      .map(v => {
        const distance = v.distance;
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

  const subscribeVehicules = () => {
    window.AuSu.store.subscribe(() => {
      const p = window.AuSu.state;
      const s = window.AuSu.store.getState();
      if (!p.visible && s.visible) getVehicules();
      if (!p.superOpen && s.superOpen) getVehicules();
      if (p.vehicules !== s.vehicules) updateVehicules();
    });
  };
  window.AuSu.vehicules = { subscribeVehicules };
})();
