const Joi = require('joi');
const AppError = require('../utils/AppError');

module.exports = function (schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const message = error.details.map((details) => details.message).join();
      throw new AppError(400, message);
    } else {
      next();
    }
  };
};
