const passport = require('passport');

module.exports = passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/login',
});
