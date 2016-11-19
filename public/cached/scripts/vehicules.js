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
    window.AuSu.utils.get('./api/vehicules').then(vehicules => {
      window.AuSu.store.dispatch({
        type: 'VEHICULES',
        vehicules: vehicules.slice(0, 5),
      });
    });
  };

  const subscribeVehicules = () => {
    window.AuSu.utils.subscribeStore(({ p, s }) => {
      if (!p.visible && s.visible) getVehicules();
      if (p.vehicules !== s.vehicules) updateVehicules();
    });
  };
  window.AuSu.vehicules = { subscribeVehicules, getVehicules };
})();
