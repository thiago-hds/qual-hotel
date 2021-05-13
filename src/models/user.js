const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const passportSettings = require('../settings/passport_settings');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
});
userSchema.plugin(passportLocalMongoose, passportSettings);

module.exports = mongoose.model('User', userSchema);
