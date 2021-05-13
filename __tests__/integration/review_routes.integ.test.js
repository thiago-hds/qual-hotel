const supertest = require('supertest');
const factory = require('../factories');
const app = require('../../src/app');
const Hotel = require('../../src/models/hotel');
const Review = require('../../src/models/review');

const request = supertest(app);

describe('Hotel Review', () => {
  describe('Store', () => {
    it('should store a new hotel review when the request data is valid', async () => {
      // Arrange
      const newHotel = await factory.create('Hotel');
      const reviewData = await factory.attrs('Review');
      const requestBody = { review: reviewData };

      // Act
      const res = await request
        .post(`/hotels/${newHotel._id}/reviews`)
        .type('form')
        .send(requestBody);
      const foundHotel = await Hotel.findById(newHotel._id);
      const review = await Review.findOne(reviewData);

      // Assert
      expect(res.status).toBe(302);
      expect(res.redirect).toBe(true);
      expect(review).toBeDefined();
      expect(foundHotel.reviews).toContainEqual(review._id);
    });

    it('should not store a new hotel review when the request data is invalid', async () => {
      // Arrange
      const hotel = await factory.create('Hotel');
      const reviewData = await factory.attrs('Review', {
        rating: 10,
        text: undefined,
      });
      const requestBody = { review: reviewData };

      // Act
      const res = await request
        .post(`/hotels/${hotel._id}/reviews`)
        .type('form')
        .send(requestBody);
      const reviewExists = await Review.exists(reviewData);

      // Assert
      expect(res.status).toBe(400);
      expect(reviewExists).toBe(false);
    });
  });

  describe('Delete', () => {
    it('should delete a review', async () => {
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
      expect(res.status).toBe(302);
      expect(res.redirect).toBe(true);
      expect(reviewExists).toBe(false);
    });
  });
});
