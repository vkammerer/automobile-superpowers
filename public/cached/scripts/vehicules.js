(() => {
  const vehiculesContentDiv = document.querySelector('#vehiculesContent');

  const updateVehicules = () => {
    const s = window.AuSu.store.getState();
    const vehiculesHTML = s.vehicules
      .map(v => {
        const distance = v.distance;
        const number = v.Name;
        const energy = v.EnergyLevel;
        const typeClassName = v.ModelName === 'LEAF' ? 'vehiculeLeaf' : 'vehiculePrius';
        const selectedClassName = v.selected ? 'selected' : '';
        const graphRatio = v.distance / s.vehicules[s.vehicules.length - 1].distance;
        const graphStyle = `transform: scaleX(${graphRatio})`;
        return `
          <button class="vehicule ${typeClassName} ${selectedClassName}" data-number="${number}">
            <div class="vehiculeGraph" style="${graphStyle}"></div>
            <div class="vehiculeDistance">
              ${distance}m
            </div>
            <div class="vehiculeEnergy">
              ${energy}%
            </div>
            <div class="vehiculeId">
              ${number}
            </div>
          </button>
        `;
      })
      .join('');
    vehiculesContentDiv.innerHTML = vehiculesHTML;
  };

  const getVehicule = () => {
    window.AuSu.utils.get('./api/vehicule').then(vehicule =>
      window.AuSu.store.dispatch({
        type: 'VEHICULE',
        vehicule,
      }));
  };

  const getVehicules = () => {
    window.AuSu.utils.get('./api/vehicules').then(vehicules => {
      window.AuSu.store.dispatch({
        type: 'VEHICULES',
        vehicules: vehicules.slice(0, 5),
      });
    });
  };

  const toggleVehicule = vehiculeNumber => {
    const s = window.AuSu.store.getState();
    const vehicule = s.vehicules.find(v => v.Name === vehiculeNumber);
    const data = {
      vehicule,
      pushAuth: s.pushAuth,
    };
    window.AuSu.utils.post('./api/vehicule', data).then(results => {
      window.AuSu.store.dispatch({
        type: 'VEHICULE',
        vehicule: results,
      });
      getVehicules();
    });
  };

  document.querySelector('#vehiculesContent').onclick = e => {
    const vehiculeDiv = e.target.closest('.vehicule');
    if (!vehiculeDiv) return;
    toggleVehicule(vehiculeDiv.dataset.number);
  };

  const subscribeVehicules = () => {
    window.AuSu.observeStore(window.AuSu.store, s => s, ({ p, s }) => {
      const pLocation = !p ? null : p.location;
      const pVehicule = !p ? null : p.vehicule;
      const pVehicules = !p ? null : p.vehicules;
      if (pLocation !== s.location) {
        getVehicule();
        getVehicules();
      }
      if (
        (pVehicule !== s.vehicule) ||
        (pVehicules !== s.vehicules)
      ) {
        updateVehicules();
      }
    });
  };
  window.AuSu.vehicules = { subscribeVehicules, getVehicules };
})();
