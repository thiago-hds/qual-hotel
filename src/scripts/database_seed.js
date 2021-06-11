const mongoose = require('mongoose');
const faker = require('faker');
const { Hotel, User, Review } = require('../models');

const connectionUri = process.env.DATABASE_CONNECTION_URI;
console.log(`Connecting to ${connectionUri}`);

mongoose
  .connect(connectionUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch(error => console.error(error));

const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => {
  console.log('Database connected');
});

//faker.locale = 'pt_BR';

const seedDB = async () => {
  await Hotel.deleteMany({});
  await User.deleteMany({});

  const user = new User({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
  });
  user.setPassword(faker.internet.password());
  user.save();

  for (let i = 0; i < 10; i++) {
    const hotel = new Hotel({
      name: `Hotel ${faker.company.companyName()}`,
      images: [
        {
          url:
            'https://res.cloudinary.com/dxhlfgnss/image/upload/v1622918767/qual-hotel/abyprobr18o0glviwfew.jpg',
          filename: faker.lorem.word(),
        },
        {
          url:
            'https://res.cloudinary.com/dxhlfgnss/image/upload/v1622733531/qual-hotel/hmguupgd5brlumq0lo8d.jpg',
          filename: faker.lorem.word(),
        },
        {
          url:
            'https://res.cloudinary.com/dxhlfgnss/image/upload/v1621857254/qual-hotel/rkyz9r3akyvvr38htmil.jpg',
          filename: faker.lorem.word(),
        },
      ],
      price: faker.commerce.price(),
      description: faker.company.catchPhrase(),
      address: `${faker.address.city()} - ${faker.address.stateAbbr()}`,
      location: { coordinates: [-43.944119, -19.97534], type: 'Point' },
      user: user._id,
      reviews: [],
    });

    for (let j = 0; j < 3; j++) {
      const review = new Review({
        text: faker.lorem.sentence(),
        rating: faker.random.number({
          min: 0,
          max: 5,
        }),
        user: user._id,
      });
      await review.save();
      hotel.reviews.push(review._id);
    }
    await hotel.save();
  }
};
seedDB()
  .then(() => {
    console.log('Database seeded, closing connection');
    db.close();
  })
  .catch(err => {
    console.log(err);
  });
