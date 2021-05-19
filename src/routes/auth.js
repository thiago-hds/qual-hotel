const router = require('express').Router();

const authController = require('../controllers/auth');
const wrapAsync = require('../utils/wrap_async');
const userSchema = require('../validation/user_schema');
const { validateSchema } = require('../middleware/validation');
const { authenticateUser } = require('../middleware/authentication');

router.get('/', (req, res) => {
  res.render('home');
});

router
  .route('/register')
  .get(authController.renderRegisterPage)
  .post(validateSchema(userSchema), wrapAsync(authController.register));

router
  .route('/login')
  .get(authController.renderLoginPage)
  .post(authenticateUser, wrapAsync(authController.login));

router.get('/logout', authController.logout);

module.exports = router;
