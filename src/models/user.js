const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const passportSettings = require('../settings/passport_settings');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
});
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});
userSchema.plugin(passportLocalMongoose, passportSettings);

module.exports = mongoose.model('User', userSchema);
