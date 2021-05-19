const passport = require('passport');

module.exports.authenticateUser = passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/login',
});

module.exports.isUserAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'Você deve fazer login');
    return res.redirect('/login');
  }
  return next();
};
