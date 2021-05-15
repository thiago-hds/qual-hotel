module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'Você deve fazer login');
    return res.redirect('/login');
  }
  return next();
};
