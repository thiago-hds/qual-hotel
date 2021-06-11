const mapboxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_PUBLIC_TOKEN;
const geocoder = mapboxGeocoding({ accessToken: mapboxToken });

module.exports = { geocoder };
