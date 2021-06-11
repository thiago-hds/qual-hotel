const { geocoder } = require('../libs/mapbox');

module.exports = async function (query, limit = 1) {
  const geoData = await geocoder.forwardGeocode({ query, limit }).send();
  return geoData.body.features;
};
