const routes = require('express').Router({ mergeParams: true });

const wrapAsync = require('../src/utils/wrap_async');
const validateSchema = require('../src/middleware/validate_schema');

const Review = require('../src/models/review');
const Hotel = require('../src/models/hotel');
const reviewSchema = require('../src/validation/review_schema');
const AppError = require('../src/utils/app_error');

routes.post(
  '/',
  validateSchema(reviewSchema),
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);

    if (!hotel) throw new AppError(404, 'Hotel not found ');

    const review = new Review(req.body.review);
    hotel.reviews.push(review);
    await review.save();
    await hotel.save();
    res.redirect(`/hotels/${id}`);
  })
);

routes.delete(
  '/:reviewId',
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Hotel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/hotels/${id}`);
  })
);

module.exports = routes;
