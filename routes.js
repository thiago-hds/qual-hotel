const routes = require('express').Router();
const Hotel = require('./models/hotel');

routes.get('/', (req, res) => {
  res.render('home');
});

routes.get('/makehotel', async (req, res) => {
  const hotel = new Hotel({
    name: 'El Royale',
    description: "It's a great hotel!",
    price: '90.99',
    location: 'Los Angeles CA',
  });
  await hotel.save();
  res.send(hotel);
});

module.exports = routes;
