module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'Você deve fazer login');
    return res.redirect(401, '/login');
  }
  return next();
};
