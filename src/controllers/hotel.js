const Hotel = require('../models/hotel');
const AppError = require('../utils/app_error');

module.exports.index = async (req, res) => {
  const hotels = await Hotel.find({});
  res.render('hotels/index', { hotels });
};

module.exports.create = (req, res) => {
  res.render('hotels/edit', { hotel: null });
};

module.exports.store = async (req, res) => {
  const hotel = new Hotel(req.body.hotel);
  hotel.user = req.user._id;
  await hotel.save();
  req.flash('success', 'Hotel criado com sucesso');
  res.redirect(303, `/hotels/${hotel._id}`);
};

module.exports.show = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: { path: 'user', select: 'firstName lastName' },
    })
    .populate({ path: 'user', select: 'firstName lastName' });
  if (!hotel) {
    throw new AppError(404, ' Hotel not found');
  }
  res.render('hotels/show', { hotel });
};

module.exports.edit = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    throw new AppError(404, ' Hotel not found');
  }
  res.render('hotels/edit', { hotel });
};

module.exports.update = async (req, res) => {
  const { id } = req.params;
  await Hotel.findByIdAndUpdate(id, req.body.hotel);
  req.flash('success', 'Hotel editado com sucesso');
  res.redirect(303, `/hotels/${id}`);
};

module.exports.destroy = async (req, res) => {
  const { id } = req.params;
  await Hotel.findByIdAndDelete(id);
  req.flash('success', 'Hotel excluído com sucesso');
  res.redirect('/hotels');
};
