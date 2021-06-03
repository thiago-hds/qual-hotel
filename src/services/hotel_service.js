const { Hotel } = require('../models');
const AppError = require('../utils/app_error');

class HotelService {
  async findAll() {
    return await Hotel.find({});
  }

  async findById(hotelId) {
    return Hotel.findById(hotelId)
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'firstName lastName' },
      })
      .populate({ path: 'user', select: 'firstName lastName' });
  }

  async store(hotelData, userAuthorId) {
    const newHotel = new Hotel(hotelData);
    newHotel.user = userAuthorId;
    return await newHotel.save();
  }

  async update(hotelId, hotelData) {
    await Hotel.findByIdAndUpdate(hotelId, hotelData);
  }

  async destroy(hotelId) {
    await Hotel.findByIdAndDelete(hotelId);
  }

  async associateReview(hotelId, review) {
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      throw new AppError(404, 'Hotel not found');
    }
    hotel.reviews.push(review);
    await hotel.save();
  }

  async disassociateReview(hotelId, reviewId) {
    await Hotel.findByIdAndUpdate(hotelId, { $pull: { reviews: reviewId } });
  }
}
module.exports = HotelService;
