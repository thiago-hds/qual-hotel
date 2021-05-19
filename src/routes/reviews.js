const routes = require('express').Router({ mergeParams: true });

const wrapAsync = require('../utils/wrap_async');
const { validateSchema } = require('../middleware/validation');
const { isUserAuthenticated } = require('../middleware/authentication');
const { isUserReviewCreator } = require('../middleware/authorization');

const Review = require('../models/review');
const Hotel = require('../models/hotel');
const reviewSchema = require('../validation/review_schema');
const AppError = require('../utils/app_error');

routes.post(
  '/',
  isUserAuthenticated,
  validateSchema(reviewSchema),
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);

    if (!hotel) throw new AppError(404, 'Hotel not found ');

    const review = new Review(req.body.review);
    review.user = req.user._id;
    hotel.reviews.push(review);
    await review.save();
    await hotel.save();
    req.flash('success', 'Avaliação incluída com sucesso');
    res.redirect(303, `/hotels/${id}`);
  })
);

routes.delete(
  '/:reviewId',
  isUserAuthenticated,
  isUserReviewCreator,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Hotel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Avaliação excluída com sucesso');
    res.redirect(`/hotels/${id}`);
  })
);

module.exports = routes;
