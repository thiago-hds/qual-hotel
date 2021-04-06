const Joi = require('joi');
const hotelSchema = require('../validation/hotelSchema');
const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
  const { error } = hotelSchema.validate(req.body);
  if (error) {
    const message = error.details.map((details) => details.message).join();
    throw new AppError(400, message);
  } else {
    next();
  }
};
