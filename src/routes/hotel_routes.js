const router = require('express').Router();
const multer = require('multer');
const wrapAsync = require('../utils/wrap_async');
const hotelSchema = require('../validation/hotel_schema');
const { isUserAuthenticated } = require('../middleware/authentication');
const { isUserHotelCreator } = require('../middleware/authorization');
const { validateSchema } = require('../middleware/validation');
const hotelController = require('../controllers/hotel_controller');
const { storage: cloudinaryStorage } = require('../libs/cloudinary');
const geocode = require('../utils/geocode');

const upload = multer({ storage: cloudinaryStorage });

// teste
router.route('/geo').get(
  wrapAsync(async (req, res) => {
    const geoData = await geocode(
      'Avenida Augusto de Lima, 479 Belo Horizonte MG'
    );
    res.send(geoData);
  })
);

router
  .route('/')
  .get(wrapAsync(hotelController.index))
  .post(
    isUserAuthenticated,
    upload.array('images'),
    validateSchema(hotelSchema),
    wrapAsync(hotelController.store)
  );

router.get('/new', isUserAuthenticated, hotelController.create);

router.get(
  '/:id/edit',
  isUserAuthenticated,
  isUserHotelCreator,
  wrapAsync(hotelController.edit)
);

router
  .route('/:id')
  .get(wrapAsync(hotelController.show))
  .put(
    isUserAuthenticated,
    isUserHotelCreator,
    validateSchema(hotelSchema),
    wrapAsync(hotelController.update)
  )
  .delete(
    isUserAuthenticated,
    isUserHotelCreator,
    wrapAsync(hotelController.destroy)
  );

module.exports = router;
