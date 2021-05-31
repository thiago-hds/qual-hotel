const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const passportConfig = require('../config/passport_config');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
});
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});
userSchema.plugin(passportLocalMongoose, passportConfig);

module.exports = mongoose.model('User', userSchema);
