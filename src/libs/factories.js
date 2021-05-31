const faker = require('faker');
const User = require('../models/user');
const Hotel = require('../models/hotel');
const Review = require('../models/review');

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

factory.define('Review', Review, ({ associateUser = true }) => {
  let attrs = {
    rating: factory.chance('integer', { min: 0, max: 5 }),
    text: factory.chance('paragraph'),
  };

  if (associateUser) {
    attrs.user = factory.assoc('User');
  }
  return attrs;
});

factory.define(
  'Hotel',
  Hotel,
  ({
    associateUser = true,
    associateReviews = false,
    associateImages = true,
    reviewAttrs = null,
  }) => {
    let attrs = {
      name: factory.chance('company'),
      price: factory.chance('floating', { min: 0, max: 10000, fixed: 2 }),
      description: factory.chance('paragraph'),
      location: factory.chance('city'),
    };

    if (associateUser) {
      attrs.user = factory.assoc('User');
    }
    if (associateReviews) {
      attrs.reviews = factory.assocMany('Review', 3, '_id', reviewAttrs);
    }
    if (associateImages) {
      attrs.images = [
        {
          url: factory.chance('url', { extensions: ['gif', 'jpg', 'png'] }),
          filename: factory.chance('word'),
        },
      ];
    }
    return attrs;
  }
);

module.exports = factory;
