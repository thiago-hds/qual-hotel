const mongoose = require('mongoose');

module.exports = (error, req, res, next) => {
  if (error instanceof mongoose.CastError) {
    error.statusCode = 404;
    error.message = 'Not found';
  }

  const { statusCode = 500 } = error;
  if (!error.message) {
    error.message = 'Internal sever error';
  }
  res.status(statusCode).render('error', { error });
  return next(error);
};
