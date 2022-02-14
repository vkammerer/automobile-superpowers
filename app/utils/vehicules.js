const request = require('superagent');
const moment = require('moment');
const { uniqBy, values } = require('lodash');
const { superPromise } = require('./promise');
const { sendVehiculeNotification } = require('./push');
const { store } = require('../store');

const WATCH_DURATION_MINUTES = 59;
const URI = 'https://www.reservauto.net/WCF/LSI/LSIBookingService.asmx/GetVehicleProposals';

const MONTREAL_LOCATION = {
  lat: 45.5032746,
  lng: -73.61935040000003,
};

const sortVehicules = (vehicules, { lat, lng }) => vehicules
  .map(vehicule => {
    const width = lat - vehicule.Position.Lat;
    const height = lng - vehicule.Position.Lon;
    const distance = Math.floor(Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) * 100000);
    return Object.assign({}, vehicule, { distance });
  })
  .sort((v1, v2) => v1.distance - v2.distance);

const fetchVehicules = () => {
  const { lat, lng } = MONTREAL_LOCATION;
  const sPromise = superPromise();
  request
    .get(URI)
    .query({ CustomerID: '""' })
    .query({ Latitude: lat })
    .query({ Longitude: lng })
    .set('Host', 'www.reservauto.net')
    .set('Referer', 'https://www.reservauto.net/Scripts/Client/Mobile/Default.asp?BranchID=1')
    .set('Accept', 'application/json')
    .then(pData => {
      const JSONData = pData.res.text.substring(1).substring(0, pData.res.text.length - 3);
      sPromise.resolve(JSON.parse(JSONData).Vehicules);
    })
    .catch(sPromise.reject);
  return sPromise.promise;
};

const getUserVehicules = userId => {
  const state = store.getState();
  const user = state.users[userId];
  const augmentedUserVehicule = Object.assign({}, user.vehicule, { selected: true });
  const userVehicules = uniqBy(
    [augmentedUserVehicule, ...state.vehicules],
    vehicule => vehicule.Name
  ).filter(vehicule => vehicule.Name);
  return sortVehicules(userVehicules, user.location);
};

const getNewClosestVehicule = userId => {
  const user = store.getState().users[userId];
  const closestVehicule = getUserVehicules(userId)[0];
  if (
    user.notifiedVehicules.includes(closestVehicule.Name) ||
    closestVehicule.distance > user.radius
  ) return null;
  return closestVehicule;
};

const checkIfShouldSendVehiculeNotifications = () => {
  const users = store.getState().users;
  const now = moment();
  const watchingUsers = values(users)
    .filter(user => {
      const timeDiff = now.diff(user.watchTime, 'minutes');
      return user.watchTime && timeDiff < WATCH_DURATION_MINUTES;
    });
  watchingUsers.forEach(user => {
    const newClosestVehicule = getNewClosestVehicule(user.id);
    if (newClosestVehicule) {
      sendVehiculeNotification(user.id, newClosestVehicule)
        .then(() => {
          store.dispatch({
            type: 'VEHICULE_NOTIFICATION',
            userId: user.id,
            vehiculeId: newClosestVehicule.Name,
          });
        });
    }
  });
};

module.exports = {
  fetchVehicules,
  getUserVehicules,
  checkIfShouldSendVehiculeNotifications,
};
