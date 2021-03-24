const routes = require('express').Router();
const wrapAsync = require('./src/utils/wrapAsync');
const Hotel = require('./src/models/hotel');
const AppError = require('./src/utils/AppError');

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
  wrapAsync(async (req, res, next) => {
    if (!req.body.hotel) {
      throw new AppError(400, 'Invalid hotel data');
    }
    const hotel = new Hotel(req.body.hotel);
    await hotel.save();
    res.redirect(`/hotels/${hotel._id}`);
  })
);

routes.get(
  '/hotels/:id',
  wrapAsync(async (req, res) => {
    const hotel = await Hotel.findById(req.params.id);
    res.render('hotels/show', { hotel });
  })
);

routes.get(
  '/hotels/:id/edit',
  wrapAsync(async (req, res) => {
    const hotel = await Hotel.findById(req.params.id);
    res.render('hotels/edit', { hotel });
  })
);

routes.put(
  '/hotels/:id',
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

routes.all('*', (req, res, next) => {
  next(new AppError(404, 'Page not found'));
});

module.exports = routes;
