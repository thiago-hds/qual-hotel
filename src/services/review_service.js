const Review = require('../models/review');

class ReviewService {
  async store(reviewData) {
    const review = new Review(reviewData);
    return await review.save();
  }

  async destroy(reviewId) {
    await Review.findByIdAndDelete(reviewId);
  }
}

module.exports = ReviewService;
