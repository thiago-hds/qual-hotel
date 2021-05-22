const HotelService = require('../services/hotel_service');
const ReviewService = require('../services/review_service');
const AppError = require('../utils/app_error');

const hotelService = new HotelService();
const reviewService = new ReviewService();

module.exports.store = async (req, res) => {
  const { id: hotelId } = req.params;
  const { review: reviewData } = req.body;

  const hotel = await hotelService.findById(hotelId);
  if (!hotel) throw new AppError(404, 'Hotel not found ');

  reviewData.user = req.user._id;
  const review = await reviewService.store(reviewData);
  await hotelService.associateReview(hotelId, review);

  req.flash('success', 'Avaliação incluída com sucesso');
  res.redirect(303, `/hotels/${hotelId}`);
};

module.exports.destroy = async (req, res) => {
  const { id: hotelId, reviewId } = req.params;

  await hotelService.disassociateReview(hotelId, reviewId);
  await reviewService.destroy(reviewId);

  req.flash('success', 'Avaliação excluída com sucesso');
  res.redirect(`/hotels/${hotelId}`);
};
