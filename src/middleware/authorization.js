const { Hotel, Review } = require('../models');

module.exports.isUserHotelCreator = async (req, res, next) => {
  const { id } = req.params;
  const hotel = await Hotel.findById(id);
  if (hotel && !hotel.user.equals(req.user._id)) {
    req.flash('error', 'Você não tem permissão para acessar esse recurso');
    return res.redirect(`/hotels/${id}`);
  }
  next();
};
module.exports.isUserReviewCreator = async (req, res, next) => {
  const { id: hotelId, reviewId } = req.params;
  const hotel = await Hotel.findById(hotelId);
  const review = await Review.findById(reviewId);
  if (hotel && review && !review.user.equals(req.user._id)) {
    req.flash('error', 'Você não tem permissão para acessar esse recurso');
    return res.redirect(`/hotels/${hotelId}`);
  }
  next();
};
