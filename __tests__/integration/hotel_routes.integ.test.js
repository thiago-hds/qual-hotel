const supertest = require('supertest');
const faker = require('faker');
const factory = require('../../src/libs/factories');
const app = require('../../src/app');
const { Hotel, Review } = require('../../src/models');

describe('Hotel', () => {
  describe('Authenticated User', () => {
    const agent = supertest.agent(app);
    let loggedInUser = null;

    beforeEach(async () => {
      const password = faker.internet.password();
      loggedInUser = await factory.create('User', { password });

      await agent
        .post('/login')
        .type('form')
        .send({ email: loggedInUser.email, password })
        .expect(303)
        .expect('location', '/');
    });

    describe('GET /hotels/new', () => {
      it('should return status 200 (ok) when the user is authenticated', async () => {
        // Act
        const res = await agent.get('/hotels/new').send();

        // Assert
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch('html');
      });
    });

    describe('POST /hotels', () => {
      it('should return status 303 (see other) and redirect to /hotels when the request data is valid', async () => {
        // Arrange
        const validHotelData = await factory.attrs(
          'Hotel',
          {},
          { associateUser: false, associateImages: false }
        );
        const requestBody = { hotel: validHotelData };

        // Act
        const res = await agent.post('/hotels').type('form').send(requestBody);
        const newHotelExists = await Hotel.exists({
          name: validHotelData.name,
        });

        // Assert
        expect(res.status).toBe(303);
        expect(res.redirect).toBe(true);
        expect(res.headers['location']).toMatch('/hotels');
        expect(newHotelExists).toBe(true);
      });

      it('should return status 303 (see other) and redirect to /hotels when the request data is valid and uploading images', async () => {
        // Arrange
        const hotelData = await factory.attrs(
          'Hotel',
          {},
          { associateUser: false, associateImages: false }
        );

        // Act
        const res = await agent
          .post('/hotels')
          .type('form')
          .field('hotel[name]', hotelData.name)
          .field('hotel[price]', hotelData.price)
          .field('hotel[description]', hotelData.description)
          .field('hotel[location]', hotelData.location)
          .attach('images', '__tests__/fixtures/hotel.jpg')
          .attach('images', '__tests__/fixtures/hotel2.jpg')
          .on('error', (err) => {
            // console.log(err);
          });

        const newHotel = await Hotel.findOne({
          name: hotelData.name,
        });

        // Assert
        expect(res.status).toBe(303);
        expect(res.redirect).toBe(true);
        expect(res.headers['location']).toMatch('/hotels');
        expect(newHotel).toBeDefined();
        expect(newHotel.images.length).toBe(2);
      });

      it('should return status 400 (bad request) when the request data is invalid', async () => {
        // Arrange
        const invalidHotelData = await factory.attrs(
          'Hotel',
          {
            description: undefined,
            price: 'price',
          },
          { associateImages: false }
        );
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
      it('should return status 200 (ok) when the user is authorized', async () => {
        // Arrange
        const hotelCreatedByLoggedInUser = await factory.create('Hotel', {
          user: loggedInUser,
        });

        // Act
        const res = await agent.get(
          `/hotels/${hotelCreatedByLoggedInUser._id}/edit`
        );

        // Assert
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch('html');
      });

      it('should return status 302 (found) and redirect to /hotels/{id} when trying to edit a hotel created by another user', async () => {
        // Arrange
        const hotelCreatedByAnotherUser = await factory.create('Hotel');

        // Act
        const res = await agent.get(
          `/hotels/${hotelCreatedByAnotherUser._id}/edit`
        );

        // Assert
        expect(res.status).toBe(302);
        expect(res.redirect).toBe(true);
        expect(res.headers['location']).toMatch(
          `/hotels/${hotelCreatedByAnotherUser._id}`
        );
      });

      it("should return status 404 (not found) when the hotel id doesn't exist", async () => {
        // Arrange
        const unsavedHotel = await factory.build('Hotel');

        // Act
        const res = await agent.get(`/hotels/${unsavedHotel._id}/edit`);

        // Assert
        expect(res.status).toBe(404);
      });
    });

    describe('PUT /hotels/{id}', () => {
      it('should return status 303 (see other) and redirect to /hotels when the request data is valid', async () => {
        // Arrange
        const existentHotel = await factory.create('Hotel', {
          user: loggedInUser,
        });
        const updatedHotelData = await factory.attrs(
          'Hotel',
          {},
          { associateUser: false, associateImages: false }
        );
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
        expect(res.status).toBe(303);
        expect(res.headers['location']).toMatch('/hotels');
        expect(updatedHotelExists).toBe(true);
      });

      it('should return status 400 (bad request) when the request data is invalid', async () => {
        // Arrange
        const existentHotel = await factory.create('Hotel', {
          user: loggedInUser,
        });
        const invalidHotelData = await factory.attrs(
          'Hotel',
          {
            description: undefined,
            price: 'price',
          },
          { associateUser: false, associateImages: false }
        );
        const requestBody = { hotel: invalidHotelData };

        // Act
        const res = await agent
          .put(`/hotels/${existentHotel._id}`)
          .type('form')
          .send(requestBody);
        const updatedHotelExists = await Hotel.exists({
          name: invalidHotelData.name,
        });

        // Assert
        expect(res.status).toBe(400);
        expect(updatedHotelExists).toBe(false);
      });

      it('should return status 302 (found) and redirect to /hotels/{id} when trying to update a hotel created by another user', async () => {
        // Arrange
        const hotelCreatedByAnotherUser = await factory.create('Hotel');
        const updatedHotelData = await factory.attrs(
          'Hotel',
          {},
          { associateUser: false, associateImages: false }
        );
        const requestBody = { hotel: updatedHotelData };

        // Act
        const res = await agent
          .put(`/hotels/${hotelCreatedByAnotherUser._id}`)
          .type('form')
          .send(requestBody);
        const updatedHotelExists = await Hotel.exists({
          name: updatedHotelData.name,
        });

        // Assert
        expect(res.status).toBe(302);
        expect(res.redirect).toBe(true);
        expect(res.headers['location']).toMatch(
          `/hotels/${hotelCreatedByAnotherUser._id}`
        );
        expect(updatedHotelExists).toBe(false);
      });
    });

    describe('DELETE /hotels/{id}', () => {
      it('should return status 302 (found) and redirect to /hotels when hotel is deleted', async () => {
        // Arrange
        const hotel = await factory.create('Hotel', { user: loggedInUser });

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
          { user: loggedInUser },
          { associateReviews: true }
        );

        // Act
        const res = await agent.delete(`/hotels/${hotel._id}`);
        const reviewExists = await Review.exists({ _id: hotel.reviews[0]._id });

        // Assert
        expect(reviewExists).toBe(false);
      });

      it('should return status 302 (found) and redirect to /hotels/{id} when trying to delete a hotel created by another user', async () => {
        // Arrange
        const hotelCreatedByAnotherUser = await factory.create('Hotel');

        // Act
        const res = await agent.delete(
          `/hotels/${hotelCreatedByAnotherUser._id}`
        );
        const hotelExists = await Hotel.exists({
          _id: hotelCreatedByAnotherUser._id,
        });

        // Assert
        expect(res.status).toBe(302);
        expect(res.redirect).toBe(true);
        expect(res.headers['location']).toMatch(
          `/hotels/${hotelCreatedByAnotherUser._id}`
        );
        expect(hotelExists).toBe(true);
      });
    });
  });

  describe('Unauthenticated User', () => {
    const request = supertest(app);

    describe('GET /hotels', () => {
      it('should return status 200', async () => {
        // Act
        const res = await request.get('/hotels');

        // Assert
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch('html');
      });
    });

    describe('GET /hotels/{id}', () => {
      it('should return status 200 (ok) when the hotel id exists', async () => {
        // Arrange
        const hotel = await factory.create('Hotel');

        // Act
        const res = await request.get(`/hotels/${hotel._id}`);

        // Assert
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch('html');
        expect(res.text).toMatch(new RegExp(hotel.name));
      });

      it("should return status 404 (not found) when the hotel id doesn't exist", async () => {
        // Arrange
        const unsavedHotel = await factory.build('Hotel');

        // Act
        const res = await request.get(`/hotels/${unsavedHotel._id}`);

        // Assert
        expect(res.status).toBe(404);
      });
    });

    describe('GET /hotels/new', () => {
      it('should return status 302 (found) and redirect to /login when the user is unauthenticated', async () => {
        // Act
        const res = await request.get('/hotels/new');

        // Assert
        expect(res.status).toBe(302);
        expect(res.redirect).toBe(true);
        expect(res.headers['location']).toMatch('/login');
      });
    });

    describe('POST /hotels', () => {
      it('should return status 302 (found) and redirect to /login when the user is unauthenticated', async () => {
        // Arrange
        const validHotelData = await factory.attrs(
          'Hotel',
          {},
          { associateImages: false }
        );
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
      it('should return status 302 (found) and redirect to /login when user is unauthenticated', async () => {
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
      it('should return status 302 (found) and redirect to /login when the user is unauthenticated', async () => {
        // Arrange
        const existentHotel = await factory.create('Hotel');
        const updatedHotelData = await factory.attrs(
          'Hotel',
          {},
          { associateImages: false }
        );
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
      it('should return status 302 (found) and redirect to /login when the user is unauthenticated', async () => {
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
