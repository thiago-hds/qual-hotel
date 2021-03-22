const faker = require('faker');
const Hotel = require('../src/models/hotel');

const { factory } = require('factory-girl');

factory.define('Hotel', Hotel, {
  name: `Hotel ${faker.company.companyName()}`,
  image: 'https://source.unsplash.com/collection/9273901',
  price: faker.commerce.price(),
  description: faker.company.catchPhrase(),
  location: `${faker.address.city()} - ${faker.address.stateAbbr()}`,
});

module.exports = factory;
