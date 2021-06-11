const AppError = require('../utils/app_error');

module.exports.validateSchema = function (schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const message = error.details.map(details => details.message).join();
      throw new AppError(400, message);
    } else {
      next();
    }
  };
};
