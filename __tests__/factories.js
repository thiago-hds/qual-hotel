const faker = require('faker');
const Hotel = require('../src/models/hotel');
const Review = require('../src/models/review');

const { factory } = require('factory-girl');

factory.define('Review', Review, {
  rating: Math.floor(Math.random() * 6),
  text: faker.lorem.paragraph(),
});

factory.define('Hotel', Hotel, {
  name: `Hotel ${faker.company.companyName()}`,
  image: 'https://source.unsplash.com/collection/9273901',
  price: faker.commerce.price(),
  description: faker.company.catchPhrase(),
  location: `${faker.address.city()} - ${faker.address.stateAbbr()}`,
  reviews: factory.assocMany('Review', 3),
});

module.exports = factory;
