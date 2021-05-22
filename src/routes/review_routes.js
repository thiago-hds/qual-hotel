const routes = require('express').Router({ mergeParams: true });

const reviewController = require('../controllers/review_controller');
const wrapAsync = require('../utils/wrap_async');
const reviewSchema = require('../validation/review_schema');
const { validateSchema } = require('../middleware/validation');
const { isUserAuthenticated } = require('../middleware/authentication');
const { isUserReviewCreator } = require('../middleware/authorization');

routes.post(
  '/',
  isUserAuthenticated,
  validateSchema(reviewSchema),
  wrapAsync(reviewController.store)
);

routes.delete(
  '/:reviewId',
  isUserAuthenticated,
  isUserReviewCreator,
  wrapAsync(reviewController.destroy)
);

module.exports = routes;
