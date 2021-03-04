const { Schema, model } = require('mongoose');

const hotelSchema = new Schema({
  title: String,
  price: String,
  description: String,
  location: String,
});

module.exports = model('Hotel', hotelSchema);
