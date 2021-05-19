const express = require('express');
const routes = express.Router();

const User = require('../models/user');
const wrapAsync = require('../utils/wrap_async');
const userSchema = require('../validation/user_schema');
const { validateSchema } = require('../middleware/validation');
const { authenticateUser } = require('../middleware/authentication');

routes.get('/', (req, res) => {
  res.render('home');
});

routes.get('/register', (req, res) => {
  res.render('auth/register');
});

routes.post(
  '/register',
  validateSchema(userSchema),
  wrapAsync(async (req, res) => {
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
  })
);

routes.get('/login', (req, res) => {
  res.render('auth/login');
});

routes.post(
  '/login',
  authenticateUser,
  wrapAsync(async (req, res) => {
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;

    req.flash('success', `Bem vindo de volta, ${req.user.firstName}!`);
    res.redirect(303, redirectUrl);
  })
);

routes.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Sessão encerrada com sucesso');
  res.redirect('/');
});

module.exports = routes;
