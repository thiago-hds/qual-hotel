const Joi = require('joi');

module.exports = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(0).max(5),
    text: Joi.string().required(),
  }).required(),
});
