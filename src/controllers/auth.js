const User = require('../models/user');

module.exports.renderRegisterPage = (req, res) => {
  res.render('auth/register');
};

module.exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body.user;
    const user = new User({ firstName, lastName, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', `Olá ${user.firstName}!`);
      res.redirect(303, '/');
    });
  } catch (err) {
    req.flash('error', err.message);
    res.status(400).render('auth/register');
  }
};

module.exports.renderLoginPage = (req, res) => {
  res.render('auth/login');
};

module.exports.login = async (req, res) => {
  const redirectUrl = req.session.returnTo || '/';
  delete req.session.returnTo;

  req.flash('success', `Bem vindo de volta, ${req.user.firstName}!`);
  res.redirect(303, redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'Sessão encerrada com sucesso');
  res.redirect('/');
};
