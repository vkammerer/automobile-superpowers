const sortVehicules = (vehicules, { lat, lng }) => vehicules
  .map(v => {
    const width = lat - v.Position.Lat;
    const height = lng - v.Position.Lon;
    const distance = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    return {
      vehicule: v,
      distance,
    };
  })
  .sort((v1, v2) => v1.distance - v2.distance);

module.exports = { sortVehicules };
