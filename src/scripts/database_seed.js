const mongoose = require('mongoose');
const faker = require('faker');
const Hotel = require('../models/hotel');
const User = require('../models/user');

const connectionUri = process.env.DATABASE_CONNECTION_URI;
console.log(`Connecting to ${connectionUri}`);

mongoose
  .connect(connectionUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.error(error));

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
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
      image: 'https://source.unsplash.com/collection/9273901',
      price: faker.commerce.price(),
      description: faker.company.catchPhrase(),
      location: `${faker.address.city()} - ${faker.address.stateAbbr()}`,
      user: user._id,
    });
    await hotel.save();
  }
};
seedDB()
  .then(() => {
    console.log('Database seeded, closing connection');
    db.close();
  })
  .catch((err) => {
    console.log(err);
  });
