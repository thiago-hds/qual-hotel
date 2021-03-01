import { Schema } from "mongoose";

const { Schema } = require('mongoose');

const hotelSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Hotel', hotelSchema);