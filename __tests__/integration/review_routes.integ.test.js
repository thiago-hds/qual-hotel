const supertest = require('supertest');
const faker = require('faker');
const factory = require('../factories');
const app = require('../../src/app');
const Hotel = require('../../src/models/hotel');
const Review = require('../../src/models/review');

describe('Hotel Review', () => {
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

    describe('POST /hotels/{id}/reviews', () => {
      it('should return status 303 (see other) and redirect  when the request data is valid', async () => {
        // Arrange
        const newHotel = await factory.create('Hotel');
        const reviewData = await factory.attrs(
          'Review',
          {},
          {
            associateUser: false,
          }
        );
        const requestBody = { review: reviewData };

        // Act
        const res = await agent
          .post(`/hotels/${newHotel._id}/reviews`)
          .type('form')
          .send(requestBody);
        const foundHotel = await Hotel.findById(newHotel._id);
        const review = await Review.findOne(reviewData);

        // Assert
        expect(res.status).toBe(303);
        expect(res.redirect).toBe(true);
        expect(review).toBeDefined();
        expect(foundHotel.reviews).toContainEqual(review._id);
      });

      it('should return status 400 (bad request) when the request data is invalid', async () => {
        // Arrange
        const hotel = await factory.create('Hotel');
        const reviewData = await factory.attrs('Review', {
          rating: 10,
          text: undefined,
        });
        const requestBody = { review: reviewData };

        // Act
        const res = await agent
          .post(`/hotels/${hotel._id}/reviews`)
          .type('form')
          .send(requestBody);
        const reviewExists = await Review.exists(reviewData);

        // Assert
        expect(res.status).toBe(400);
        expect(reviewExists).toBe(false);
      });
    });

    describe('DELETE /hotels/{id}/reviews/{review_id}', () => {
      it('should return status 302 (found) and redirect to /hotels/{id} when delete a review that user owns', async () => {
        // Arrange
        const hotel = await factory.create(
          'Hotel',
          {},
          { associateReviews: true, reviewAttrs: { user: loggedInUser } }
        );
        const review = hotel.reviews[0];

        // Act
        const res = await agent.delete(
          `/hotels/${hotel._id}/reviews/${review._id}`
        );
        const reviewExists = await Review.exists({ _id: review._id });

        // Assert
        expect(res.status).toBe(302);
        expect(res.redirect).toBe(true);
        expect(res.headers['location']).toMatch(`/hotels/${hotel._id}`);
        expect(reviewExists).toBe(false);
      });

      it('should return status 302 (found) and redirect to /hotels/{id} when delete a review created by another user', async () => {
        // Arrange
        const hotel = await factory.create(
          'Hotel',
          {},
          { associateReviews: true }
        );
        const review = hotel.reviews[0];

        // Act
        const res = await agent.delete(
          `/hotels/${hotel._id}/reviews/${review._id}`
        );
        const reviewExists = await Review.exists({ _id: review._id });

        // Assert
        expect(res.status).toBe(302);
        expect(res.redirect).toBe(true);
        expect(res.headers['location']).toMatch(`/hotels/${hotel._id}`);
        expect(reviewExists).toBe(true);
      });
    });
  });

  describe('Unauthenticated User', () => {
    const request = supertest(app);

    describe('POST /hotels/{id}/reviews', () => {
      it('should return status 302 (found) and redirect to /login when the user is unauthenticated', async () => {
        // Arrange
        const newHotel = await factory.create('Hotel');
        const reviewData = await factory.attrs('Review');
        const requestBody = { review: reviewData };

        // Act
        const res = await request
          .post(`/hotels/${newHotel._id}/reviews`)
          .type('form')
          .send(requestBody);
        const reviewExists = await Review.exists(reviewData);

        // Assert
        expect(reviewExists).toBe(false);
        expect(res.status).toBe(302);
        expect(res.redirect).toBe(true);
        expect(res.headers['location']).toMatch('/login');
      });
    });

    describe('DELETE /hotels/{id}/reviews/{review_id}', () => {
      it('should return status 302 (found) and redirect to /login when the user is unauthenticated', async () => {
        // Arrange
        const hotel = await factory.create(
          'Hotel',
          {},
          { associateReviews: true }
        );
        const review = hotel.reviews[0];

        // Act
        const res = await request.delete(
          `/hotels/${hotel._id}/reviews/${review._id}`
        );
        const reviewExists = await Review.exists({ _id: review._id });

        // Assert
        expect(reviewExists).toBe(true);
        expect(res.status).toBe(302);
        expect(res.redirect).toBe(true);
        expect(res.headers['location']).toMatch('/login');
      });
    });
  });
});
