const supertest = require('supertest');
const faker = require('faker');
const factory = require('../factories');
const app = require('../../src/app');
const Hotel = require('../../src/models/hotel');
const Review = require('../../src/models/review');

describe('Hotel', () => {
  describe('Authenticated User', () => {
    const agent = supertest.agent(app);
    let authUser = null;

    beforeEach(async () => {
      const password = faker.internet.password();
      authUser = await factory.create('User', { password });

      await agent
        .post('/login')
        .type('form')
        .send({ email: authUser.email, password })
        .expect(302)
        .expect('location', '/');
    });

    describe('POST /hotels/new', () => {
      it('should render create hotel page when the user is authenticated', async () => {
        // Act
        const res = await agent.get('/hotels/new').send();

        // Assert
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch('html');
      });
    });

    describe('POST /hotels', () => {
      it('should store a new hotel when the request data is valid', async () => {
        // Arrange
        const validHotelData = await factory.attrs('Hotel');
        const requestBody = { hotel: validHotelData };

        // Act
        const res = await agent.post('/hotels').type('form').send(requestBody);
        const newHotelExists = await Hotel.exists({
          name: validHotelData.name,
        });

        // Assert
        expect(newHotelExists).toBe(true);
        expect(res.status).toBe(302);
        expect(res.redirect).toBe(true);
        expect(res.headers['location']).toMatch('/hotels');
      });

      it('should not store a new hotel when the request data is invalid', async () => {
        // Arrange
        const invalidHotelData = await factory.attrs('Hotel', {
          description: undefined,
          price: 'price',
        });
        const requestBody = { hotel: invalidHotelData };

        // Act
        const res = await agent.post('/hotels').type('form').send(requestBody);
        const newHotelExists = await Hotel.exists({
          name: requestBody.hotel.name,
        });

        // Assert
        expect(res.status).toBe(400);
        expect(newHotelExists).toBe(false);
      });
    });

    describe('GET /hotels/{id}/edit', () => {
      it('should render edit hotel page', async () => {
        // Arrange
        const hotel = await factory.create('Hotel');

        // Act
        const res = await agent.get(`/hotels/${hotel._id}/edit`);

        // Assert
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch('html');
      });

      it("should not render edit hotel page when the hotel id doesn't exist", async () => {
        // Arrange
        const unsavedHotel = await factory.build('Hotel');

        // Act
        const res = await agent.get(`/hotels/${unsavedHotel._id}/edit`);

        // Assert
        expect(res.status).toBe(404);
      });
    });

    describe('PUT /hotels/{id}', () => {
      it('should update a hotel then the request data is valid', async () => {
        // Arrange
        const existentHotel = await factory.create('Hotel');
        const updatedHotelData = await factory.attrs('Hotel');
        const requestBody = { hotel: updatedHotelData };

        // Act
        const res = await agent
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

    describe('DELETE /hotels/{id}', () => {
      it('should delete a hotel', async () => {
        // Arrange
        const hotel = await factory.create('Hotel');

        // Act
        const res = await agent.delete(`/hotels/${hotel._id}`);
        const hotelExists = await Hotel.exists({ _id: hotel._id });

        // Assert
        expect(res.status).toBe(302);
        expect(res.redirect).toBe(true);
        expect(res.headers['location']).toMatch('/hotels');
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
        const res = await agent.delete(`/hotels/${hotel._id}`);
        const reviewExists = await Review.exists({ _id: hotel.reviews[0]._id });

        // Assert
        expect(reviewExists).toBe(false);
      });
    });
  });

  describe('Unauthenticated User', () => {
    const request = supertest(app);

    describe('GET /hotels', () => {
      it('should render hotel index page', async () => {
        // Act
        const res = await request.get('/hotels');

        // Assert
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch('html');
      });
    });

    describe('GET /hotels/{id}', () => {
      it('should render show page when the hotel id exists', async () => {
        // Arrange
        const hotel = await factory.create('Hotel');

        // Act
        const res = await request.get(`/hotels/${hotel._id}`);

        // Assert
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch('html');
        expect(res.text).toMatch(new RegExp(hotel.name));
      });

      it("should return status 404 when the hotel id doesn't exist", async () => {
        // Arrange
        const unsavedHotel = await factory.build('Hotel');

        // Act
        const res = await request.get(`/hotels/${unsavedHotel._id}`);

        // Assert
        expect(res.status).toBe(404);
      });
    });

    describe('GET /hotels/new', () => {
      it('should redirect to /login when the user is unauthenticated', async () => {
        // Act
        const res = await request.get('/hotels/new');

        // Assert
        expect(res.status).toBe(302);
        expect(res.redirect).toBe(true);
        expect(res.headers['location']).toMatch('/login');
      });
    });

    describe('POST /hotels', () => {
      it('should redirect to /login when the user is unauthenticated', async () => {
        // Arrange
        const validHotelData = await factory.attrs('Hotel');
        const requestBody = { hotel: validHotelData };

        // Act
        const res = await request
          .post('/hotels')
          .type('form')
          .send(requestBody);

        const newHotelExists = await Hotel.exists(validHotelData);

        // Assert
        expect(res.status).toBe(302);
        expect(res.redirect).toBe(true);
        expect(res.headers['location']).toMatch('/login');
        expect(newHotelExists).toBe(false);
      });
    });
    describe('GET /hotels/{id}/edit', () => {
      it('should redirect to /login when user is unauthenticated', async () => {
        // Arrange
        const hotel = await factory.create('Hotel');

        // Act
        const res = await request.get(`/hotels/${hotel._id}/edit`);

        // Assert
        expect(res.status).toBe(302);
        expect(res.redirect).toBe(true);
        expect(res.headers['location']).toMatch('/login');
      });
    });

    describe('PUT /hotels/{id}', () => {
      it('should redirect to /login when the user is unauthenticated', async () => {
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
        expect(updatedHotelExists).toBe(false);
        expect(res.status).toBe(302);
        expect(res.redirect).toBe(true);
        expect(res.headers['location']).toMatch('/login');
      });
    });
    describe('DELETE /hotels/{id}', () => {
      it('should redirect to /login when the user is unauthenticated', async () => {
        // Arrange
        const hotel = await factory.create('Hotel');

        // Act
        const res = await request.delete(`/hotels/${hotel._id}`);
        const hotelExists = await Hotel.exists({ _id: hotel._id });

        // Assert
        expect(hotelExists).toBe(true);
        expect(res.status).toBe(302);
        expect(res.redirect).toBe(true);
        expect(res.headers['location']).toMatch('/login');
      });
    });
  });
});
