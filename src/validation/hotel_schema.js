const Joi = require('joi');

module.exports = Joi.object({
  hotel: Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required().min(0),
    // images: Joi.required(),
    address: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});
