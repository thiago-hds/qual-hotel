const supertest = require('supertest');
const factory = require('../factories');
const app = require('../../src/app');
const Hotel = require('../../src/models/hotel');
const Review = require('../../src/models/review');

const request = supertest(app);

describe('Hotel Review Routes', () => {
  it('should create a hotel review with valid data', async () => {
    const newHotel = await factory.create('Hotel');
    const requestBody = {
      review: {
        rating: 5,
        text: 'Great hotel!',
      },
    };

    const res = await request
      .post(`/hotels/${newHotel._id}/reviews`)
      .type('form')
      .send(requestBody);

    const hotel = await Hotel.findById(newHotel._id);
    const review = await Review.findOne({
      rating: requestBody.review.rating,
      text: requestBody.review.text,
    });

    expect(res.status).toBe(302);
    expect(res.redirect).toBe(true);
    expect(review).toBeDefined();
    expect(hotel.reviews).toContainEqual(review._id);
  });

  it('should not create a hotel review with invalid data', async () => {
    const newHotel = await factory.create('Hotel');
    const requestBody = {
      review: {
        rating: 10,
        text: undefined,
      },
    };

    const res = await request
      .post(`/hotels/${newHotel._id}/reviews`)
      .type('form')
      .send(requestBody);

    const reviewExists = await Review.exists({
      rating: requestBody.review.rating,
      text: requestBody.review.text,
    });
    expect(res.status).toBe(400);
    expect(reviewExists).toBe(false);
  });

  it('should delete a review', async () => {
    const review = await factory.create('Review');
    const hotel = await factory.create('Hotel');
    hotel.reviews.push(review);
    hotel.save();

    const res = await request.delete(
      `/hotels/${hotel._id}/reviews/${review._id}`
    );

    const reviewExists = await Review.exists({ _id: review._id });

    expect(res.status).toBe(302);
    expect(res.redirect).toBe(true);
    expect(reviewExists).toBe(false);
  });
});
