const Review = require('../models/review');
const Hotel = require('../models/hotel');
const AppError = require('../utils/app_error');

module.exports.store = async (req, res) => {
  const { id } = req.params;
  const hotel = await Hotel.findById(id);

  if (!hotel) throw new AppError(404, 'Hotel not found ');

  const review = new Review(req.body.review);
  review.user = req.user._id;
  hotel.reviews.push(review);
  await review.save();
  await hotel.save();
  req.flash('success', 'Avaliação incluída com sucesso');
  res.redirect(303, `/hotels/${id}`);
};

module.exports.destroy = async (req, res) => {
  const { id, reviewId } = req.params;
  await Hotel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Avaliação excluída com sucesso');
  res.redirect(`/hotels/${id}`);
};
