const express = require('express');
const routes = express.Router();

const User = require('../models/user');
const wrapAsync = require('../utils/wrap_async');

routes.get('/register', (req, res) => {
  res.render('auth/register');
});

routes.post(
  '/register',
  wrapAsync(async (req, res) => {
    res.send(req.body);
  })
);

module.exports = routes;
