const routes = require('express').Router();
const wrapAsync = require('../src/utils/wrap_async');
const Hotel = require('../src/models/hotel');
const AppError = require('../src/utils/app_error');
const validateSchema = require('../src/middleware/validate_schema');
const hotelSchema = require('../src/validation/hotel_schema');

routes.get(
  '/',
  wrapAsync(async (req, res) => {
    const hotels = await Hotel.find({});
    res.render('hotels/index', { hotels });
  })
);

routes.get('/new', (req, res) => {
  res.render('hotels/edit', { hotel: null });
});

routes.post(
  '/',
  validateSchema(hotelSchema),
  wrapAsync(async (req, res) => {
    const hotel = new Hotel(req.body.hotel);
    await hotel.save();
    res.redirect(`/hotels/${hotel._id}`);
  })
);

routes.get(
  '/:id',
  wrapAsync(async (req, res) => {
    const hotel = await Hotel.findById(req.params.id).populate('reviews');
    if (!hotel) {
      throw new AppError(404, ' Hotel not found');
    }
    res.render('hotels/show', { hotel });
  })
);

routes.get(
  '/:id/edit',
  wrapAsync(async (req, res) => {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      throw new AppError(404, ' Hotel not found');
    }
    res.render('hotels/edit', { hotel });
  })
);

routes.put(
  '/:id',
  validateSchema(hotelSchema),
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Hotel.findByIdAndUpdate(id, req.body.hotel);
    res.redirect(`/hotels/${id}`);
  })
);

routes.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Hotel.findByIdAndDelete(id);
    res.redirect('/hotels');
  })
);

module.exports = routes;
