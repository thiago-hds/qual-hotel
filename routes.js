const routes = require('express').Router();
const Hotel = require('./src/models/hotel');

routes.get('/', (req, res) => {
  res.render('home');
});

routes.get('/hotels', async (req, res) => {
  const hotels = await Hotel.find({});
  res.render('hotels/index', { hotels });
});

routes.get('/hotels/new', (req, res) => {
  res.render('hotels/edit', { hotel: null });
});

routes.post('/hotels', async (req, res) => {
  console.log('SAVING A NEW HOTEL');
  console.log(req.body);
  const hotel = new Hotel(req.body.hotel);
  await hotel.save();
  res.redirect(`/hotels/${hotel._id}`);
});

routes.get('/hotels/:id', async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  res.render('hotels/show', { hotel });
});

routes.get('/hotels/:id/edit', async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  res.render('hotels/edit', { hotel });
});

routes.put('/hotels/:id', async (req, res) => {
  const { id } = req.params;
  await Hotel.findByIdAndUpdate(id, req.body.hotel);
  res.redirect(`/hotels/${id}`);
});

routes.delete('/hotels/:id', async (req, res) => {
  const { id } = req.params;
  await Hotel.findByIdAndDelete(id);
  res.redirect('/hotels');
});

module.exports = routes;
