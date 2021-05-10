const routes = require('express').Router();
const wrapAsync = require('../utils/wrap_async');
const Hotel = require('../models/hotel');
const AppError = require('../utils/app_error');
const validateSchema = require('../middleware/validate_schema');
const hotelSchema = require('../validation/hotel_schema');

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
    req.flash('success', 'Hotel criado com sucesso');
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
    req.flash('success', 'Hotel editado com sucesso');
    res.redirect(`/hotels/${id}`);
  })
);

routes.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Hotel.findByIdAndDelete(id);
    req.flash('success', 'Hotel excluído com sucesso');
    res.redirect('/hotels');
  })
);

module.exports = routes;