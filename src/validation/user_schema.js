const Joi = require('joi');

module.exports = Joi.object({
  user: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).required(),
});
