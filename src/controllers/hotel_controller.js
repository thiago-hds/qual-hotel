const AppError = require('../utils/app_error');
const HotelService = require('../services/hotel_service');

const hotelService = new HotelService();

module.exports.index = async (req, res) => {
  const hotels = await hotelService.findAll();
  res.render('hotels/index', { hotels });
};

module.exports.create = (req, res) => {
  res.render('hotels/edit', { hotel: null });
};

module.exports.store = async (req, res) => {
  const hotel = hotelService.store(req.body.hotel, req.user._id);

  req.flash('success', 'Hotel criado com sucesso');
  res.redirect(303, `/hotels/${hotel._id}`);
};

module.exports.show = async (req, res) => {
  const { id } = req.params;
  const hotel = await hotelService.findById(id);

  if (!hotel) {
    throw new AppError(404, ' Hotel not found');
  }
  res.render('hotels/show', { hotel });
};

module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const hotel = await hotelService.findById(id);
  if (!hotel) {
    throw new AppError(404, ' Hotel not found');
  }
  res.render('hotels/edit', { hotel });
};

module.exports.update = async (req, res) => {
  const { id } = req.params;
  const { hotel } = req.body;

  await hotelService.update(id, hotel);

  req.flash('success', 'Hotel editado com sucesso');
  res.redirect(303, `/hotels/${id}`);
};

module.exports.destroy = async (req, res) => {
  const { id } = req.params;

  await hotelService.destroy(id);

  req.flash('success', 'Hotel excluído com sucesso');
  res.redirect('/hotels');
};
