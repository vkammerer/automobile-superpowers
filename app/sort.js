const sortVehicules = (vehicules, { lat, lng }) => vehicules
  .map(vehicule => {
    const width = lat - vehicule.Position.Lat;
    const height = lng - vehicule.Position.Lon;
    const distance = Math.floor(Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) * 100000);
    return Object.assign({}, vehicule, { distance });
  })
  .sort((v1, v2) => v1.distance - v2.distance);

module.exports = { sortVehicules };
