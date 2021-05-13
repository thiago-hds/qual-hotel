const express = require('express');
const routes = express.Router();

const User = require('../models/user');
const wrapAsync = require('../utils/wrap_async');
const validateSchemaMiddleware = require('../middleware/validate_schema');
const userSchema = require('../validation/user_schema');
const passportAuthenticate = require('../middleware/passport_authenticate');

routes.get('/register', (req, res) => {
  res.render('auth/register');
});

routes.post(
  '/register',
  validateSchemaMiddleware(userSchema),
  wrapAsync(async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body.user;
      const user = new User({ firstName, lastName, email });
      const registeredUser = await User.register(user, password);

      req.flash('success', `Bem vindo, ${user.firstName}!`);
      res.redirect('/hotels');
    } catch (err) {
      req.flash('error', err.message);
      res.redirect(400, '/register');
    }
  })
);

routes.get('/login', (req, res) => {
  res.render('auth/login');
});

routes.post(
  '/login',
  passportAuthenticate,
  wrapAsync(async (req, res) => {
    req.flash('success', `Bem vindo de volta, fulano`);
    res.redirect('/hotels');
  })
);

module.exports = routes;
