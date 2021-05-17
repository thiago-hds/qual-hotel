const faker = require('faker');
const User = require('../src/models/user');
const Hotel = require('../src/models/hotel');
const Review = require('../src/models/review');

const { factory } = require('factory-girl');

factory.define(
  'User',
  User,
  {
    firstName: factory.chance('first'),
    lastName: factory.chance('last'),
    email: factory.chance('email'),
    password: factory.chance('word'),
  },
  {
    afterBuild: (model, attrs) => {
      const password = attrs.password ?? '123';
      return model.setPassword(password);
    },
  }
);

factory.define('Review', Review, {
  rating: factory.chance('integer', { min: 0, max: 5 }),
  text: factory.chance('paragraph'),
});

factory.define('Hotel', Hotel, (buildOptions) => {
  let attrs = {
    name: factory.chance('company'),
    image: factory.chance('url', { extensions: ['gif', 'jpg', 'png'] }),
    price: factory.chance('floating', { min: 0, max: 10000, fixed: 2 }),
    description: factory.chance('paragraph'),
    location: factory.chance('city'),
  };

  if (buildOptions.associateUser) {
    attrs.user = factory.assoc('User');
  }

  if (buildOptions.associateReviews) {
    attrs.reviews = factory.assocMany('Review', 3);
  }
  return attrs;
});

module.exports = factory;
