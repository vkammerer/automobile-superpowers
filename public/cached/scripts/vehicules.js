(() => {
  const vehiculesContentDiv = document.querySelector('#vehiculesContent');
  const displayVehicules = vehicules => {
    const first5Vehicules = vehicules.slice(0, 5);
    const vehiculesHTML = first5Vehicules
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
    }).then(blob => blob.json().then(displayVehicules));
  };


  window.AuSu.vehicules = {
    getVehicules,
  };
})();
