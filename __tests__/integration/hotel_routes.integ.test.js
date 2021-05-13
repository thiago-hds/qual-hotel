const supertest = require('supertest');
const factory = require('../factories');
const app = require('../../src/app');
const Hotel = require('../../src/models/hotel');
const Review = require('../../src/models/review');
const User = require('../../src/models/user');

const request = supertest(app);

describe('Hotel', () => {
  describe('Index', () => {
    it('should render hotel index page', async () => {
      // Act
      const res = await request.get('/hotels');

      // Assert
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('html');
    });
  });

  describe('Show', () => {
    it('should render a hotel show page when the hotel id exists', async () => {
      // Arrange
      const hotel = await factory.create('Hotel');

      // Act
      const res = await request.get(`/hotels/${hotel._id}`);

      // Assert
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('html');
      expect(res.text).toMatch(new RegExp(hotel.name));
    });

    it("should not render a hotel show page when the hotel id doesn't exist", async () => {
      // Arrange
      const unsavedHotel = await factory.build('Hotel');

      // Act
      const res = await request.get(`/hotels/${unsavedHotel._id}`);

      // Assert
      expect(res.status).toBe(404);
    });
  });

  describe('Create', () => {
    it('should render create hotel page when the user is authenticated', async () => {
      // Arrange
      const user = await factory.create('User', { password: '123123' });
      await User.authenticate(user.email, '123123');

      // Act
      const res = await request.get('/hotels/new');

      // Assert
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('html');
    });

    it('should not render create hotel page when the user is unauthenticated', async () => {
      // Act
      const res = await request.get('/hotels/new');

      // Assert
      expect(res.status).toBe(401);
      expect(res.redirect).toBe(true);
    });
  });

  describe('Store', () => {
    it('should store a new hotel when the request data is valid', async () => {
      // Arrange
      const validHotelData = await factory.attrs('Hotel');
      const requestBody = { hotel: validHotelData };

      // Act
      const res = await request.post('/hotels').type('form').send(requestBody);
      const newHotelExists = await Hotel.exists({
        name: validHotelData.name,
      });

      // Assert
      expect(res.status).toBe(302);
      expect(res.redirect).toBe(true);
      expect(newHotelExists).toBe(true);
    });

    it('should not store a new hotel when the request data is invalid', async () => {
      // Arrange
      const invalidHotelData = await factory.attrs('Hotel', {
        description: undefined,
        price: 'price',
      });
      const requestBody = { hotel: invalidHotelData };

      // Act
      const res = await request.post('/hotels').type('form').send(requestBody);
      const newHotelExists = await Hotel.exists({
        name: requestBody.hotel.name,
      });

      // Assert
      expect(res.status).toBe(400);
      expect(newHotelExists).toBe(false);
    });
  });

  describe('Edit', () => {
    it('should render edit hotel page', async () => {
      // Arrange
      const hotel = await factory.create('Hotel');

      // Act
      const res = await request.get(`/hotels/${hotel._id}/edit`);

      // Assert
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('html');
    });

    it("should not render hotel edit page when the hotel id doesn't exist", async () => {
      // Arrange
      const unsavedHotel = await factory.build('Hotel');

      // Act
      const res = await request.get(`/hotels/${unsavedHotel._id}/edit`);

      // Assert
      expect(res.status).toBe(404);
    });
  });

  describe('Update', () => {
    it('should update a hotel then the request data is valid', async () => {
      // Arrange
      const existentHotel = await factory.create('Hotel');
      const updatedHotelData = await factory.attrs('Hotel');
      const requestBody = { hotel: updatedHotelData };

      // Act
      const res = await request
        .put(`/hotels/${existentHotel._id}`)
        .type('form')
        .send(requestBody);
      const updatedHotelExists = await Hotel.exists({
        name: updatedHotelData.name,
      });

      // Assert
      expect(res.redirect).toBe(true);
      expect(updatedHotelExists).toBe(true);
    });

    // TODO test update when data is invalid
  });

  describe('Delete', () => {
    it('should delete a hotel', async () => {
      // Arrange
      const hotel = await factory.create('Hotel');

      // Act
      const res = await request.delete(`/hotels/${hotel._id}`);
      const hotelExists = await Hotel.exists({ _id: hotel._id });

      // Assert
      expect(res.status).toBe(302);
      expect(res.redirect).toBe(true);
      expect(hotelExists).toBe(false);
    });

    it('should delete associated reviews when the hotel is deleted', async () => {
      // Arrange
      const hotel = await factory.create(
        'Hotel',
        {},
        { associateReviews: true }
      );

      // Act
      const res = await request.delete(`/hotels/${hotel._id}`);
      const reviewExists = await Review.exists({ _id: hotel.reviews[0]._id });

      // Assert
      expect(reviewExists).toBe(false);
    });
  });
});
