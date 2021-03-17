const routes = require('express').Router();
const Hotel = require('./src/models/hotel');

routes.get('/', (req, res) => {
  res.render('home');
});

routes.get('/hotels', async (req, res) => {
  const hotels = await Hotel.find({});
  res.render('hotels/index', { hotels });
});

routes.get('/hotels/show/:id', async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  res.render('hotels/show', { hotel });
});

module.exports = routes;
