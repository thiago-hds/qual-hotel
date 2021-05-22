const User = require('../models/user');
class AuthService {
  async register(userData) {
    const { firstName, lastName, email, password } = userData;
    const newUser = new User({ firstName, lastName, email });
    return await User.register(newUser, password);
  }
}
module.exports = AuthService;
