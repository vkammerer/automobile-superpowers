const request = require('superagent');

const addAutomobileRoutes = (app) => {
  const URI = 'https://www.reservauto.net/WCF/LSI/LSIBookingService.asmx/GetVehicleProposals';
  const lat = parseFloat(process.env.DEFAULT_LAT);
  const lng = parseFloat(process.env.DEFAULT_LNG);

  const fetchVehicules = () => request
    .get(URI)
    .query({ CustomerID: '""' })
    .query({ Latitude: lat })
    .query({ Longitude: lng })
    .set('Host', 'www.reservauto.net')
    .set('Referer', 'https://www.reservauto.net/Scripts/Client/Mobile/Default.asp?BranchID=1')
    .set('Accept', 'application/json');
  app.get('/api/automobile', (req, res) => {
    const vehiculesPromise = fetchVehicules({ lat, lng });
    vehiculesPromise
      .then((pData) => {
        const data = JSON.parse(pData.res.text.substring(1).substring(0, pData.res.text.length - 3));
        const sortedVehicules = data.Vehicules
          .map((v) => {
            const width = lat - v.Position.Lat;
            const height = lng - v.Position.Lon;
            const distance = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
            return {
              vehicule: v,
              distance,
            };
          })
          .sort((v1, v2) => v1.distance - v2.distance);
        res.json(sortedVehicules);
      });
  });
};

module.exports = { addAutomobileRoutes };
