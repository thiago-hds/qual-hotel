const mongoose = require('mongoose');
const faker = require('faker');
const Hotel = require('../../models/hotel');
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const connectionUrl = `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;
console.log(connectionUrl);

mongoose.connect(connectionUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.log.bind(console, 'Connection error'));
db.once('open', () => {
  console.log('Database connected');
});

//faker.locale = 'pt_BR';

const seedDB = async () => {
  await Hotel.deleteMany({});

  for (let i = 0; i < 10; i++) {
    const hotel = new Hotel({
      name: `Hotel ${faker.company.companyName()}`,
      image: 'https://source.unsplash.com/collection/9273901',
      price: faker.commerce.price(),
      description: faker.company.catchPhrase(),
      location: `${faker.address.city()} - ${faker.address.stateAbbr()}`,
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
