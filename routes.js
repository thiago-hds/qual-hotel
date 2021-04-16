const routes = require('express').Router();
const wrapAsync = require('./src/utils/wrapAsync');
const Hotel = require('./src/models/hotel');
const Review = require('./src/models/review');
const AppError = require('./src/utils/AppError');
const validateSchema = require('./src/middleware/validate_schema');
const hotelSchema = require('./src/validation/hotelSchema');
const reviewSchema = require('./src/validation/review_schema');

routes.get('/', (req, res) => {
  res.render('home');
});

routes.get(
  '/hotels',
  wrapAsync(async (req, res) => {
    const hotels = await Hotel.find({});
    res.render('hotels/index', { hotels });
  })
);

routes.get('/hotels/new', (req, res) => {
  res.render('hotels/edit', { hotel: null });
});

routes.post(
  '/hotels',
  validateSchema(hotelSchema),
  wrapAsync(async (req, res) => {
    const hotel = new Hotel(req.body.hotel);
    await hotel.save();
    res.redirect(`/hotels/${hotel._id}`);
  })
);

routes.get(
  '/hotels/:id',
  wrapAsync(async (req, res) => {
    const hotel = await Hotel.findById(req.params.id).populate('reviews');
    if (!hotel) {
      throw new AppError(404, ' Hotel not found');
    }
    res.render('hotels/show', { hotel });
  })
);

routes.get(
  '/hotels/:id/edit',
  wrapAsync(async (req, res) => {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      throw new AppError(404, ' Hotel not found');
    }
    res.render('hotels/edit', { hotel });
  })
);

routes.put(
  '/hotels/:id',
  validateSchema(hotelSchema),
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Hotel.findByIdAndUpdate(id, req.body.hotel);
    res.redirect(`/hotels/${id}`);
  })
);

routes.delete(
  '/hotels/:id',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Hotel.findByIdAndDelete(id);
    res.redirect('/hotels');
  })
);

routes.post(
  '/hotels/:id/reviews',
  validateSchema(reviewSchema),
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    const review = new Review(req.body.review);
    hotel.reviews.push(review);
    await review.save();
    await hotel.save();
    res.redirect(`/hotels/${id}`);
  })
);

routes.delete(
  '/hotels/:id/reviews/:reviewId',
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Hotel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/hotels/${id}`);
  })
);

routes.all('*', (req, res, next) => {
  next(new AppError(404, 'Page not found'));
});

module.exports = routes;
