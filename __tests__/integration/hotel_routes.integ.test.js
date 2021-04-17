const supertest = require('supertest');
const factory = require('../factories');
const app = require('../../src/app');
const Hotel = require('../../src/models/hotel');
const Review = require('../../src/models/review');

const request = supertest(app);

describe('Hotel Routes', () => {
  it('should render hotel index page', async () => {
    const res = await request.get('/hotels');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('html');
  });

  it('should render a hotel show page when hotel id is valid', async () => {
    const hotel = await factory.create('Hotel');

    const res = await request.get(`/hotels/${hotel._id}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('html');
    expect(res.text).toMatch(new RegExp(hotel.name));
  });

  it('should not render a hotel show page when hotel id is invalid', async () => {
    const hotelId = '1234';
    const res = await request.get(`/hotels/${hotelId}`);

    expect(res.status).toBe(404);
  });

  it('should render new hotel page', async () => {
    const res = await request.get('/hotels/new');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('html');
  });

  it('should create a hotel with valid data', async () => {
    const requestBody = {
      hotel: {
        name: 'NewHotel',
        image: 'http://server.com/image',
        price: 100.99,
        description: 'New test hotel',
        location: 'Belo Horizonte - MG',
      },
    };

    const res = await request.post('/hotels').type('form').send(requestBody);
    const newHotelExists = await Hotel.exists({ name: requestBody.hotel.name });

    expect(res.status).toBe(302);
    expect(res.redirect).toBe(true);
    expect(newHotelExists).toBe(true);
  });

  it('should not save a new hotel with invalid data', async () => {
    const requestBody = {
      hotel: {
        name: 'NewHotel',
        image: 'http://server.com/image',
        price: 'price', // string como preço
        description: undefined,
        location: 'Belo Horizonte - MG',
      },
    };

    const res = await request.post('/hotels').type('form').send(requestBody);
    const newHotelExists = await Hotel.exists({ name: requestBody.hotel.name });

    expect(res.status).toBe(400);
    expect(newHotelExists).toBe(false);
  });

  it('should render edit hotel page', async () => {
    const hotel = await factory.create('Hotel');

    const res = await request.get(`/hotels/${hotel._id}/edit`);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('html');
  });

  it('should not render a hotel edit page when hotel id is invalid', async () => {
    const hotelId = '1234';
    const res = await request.get(`/hotels/${hotelId}/edit`);

    expect(res.status).toBe(404);
  });

  it('should edit a hotel with valid data', async () => {
    const hotel = await factory.create('Hotel');

    const requestBody = {
      hotel: {
        name: 'NewHotel',
        image: 'http://server.com/image',
        price: 100.99,
        description: 'New test hotel',
        location: 'Belo Horizonte - MG',
      },
    };

    const res = await request
      .put(`/hotels/${hotel._id}`)
      .type('form')
      .send(requestBody);

    const hotelExists = await Hotel.exists({ name: requestBody.hotel.name });

    expect(res.redirect).toBe(true);
    expect(hotelExists).toBe(true);
  });

  it('should delete a hotel', async () => {
    const hotel = await factory.create('Hotel');

    const res = await request.delete(`/hotels/${hotel._id}`);

    const hotelExists = await Hotel.exists({ _id: hotel._id });
    const reviewExists = await Review.exists({ _id: hotel.reviews[0]._id });

    expect(res.status).toBe(302);
    expect(res.redirect).toBe(true);
    expect(hotelExists).toBe(false);
    expect(reviewExists).toBe(false);
  });
});
