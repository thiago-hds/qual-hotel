const supertest = require('supertest');
const User = require('../../src/models/user');
const app = require('../../src/app');
const factory = require('../factories');

const request = supertest(app);

describe('Auth', () => {
  describe('Register', () => {
    it('should render register page', async () => {
      // Act
      const res = await request.get('/register');

      // Assert
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('html');
    });

    it('should register a new user when the request data is valid', async () => {
      // Arrange
      const userData = await factory.attrs('User');
      const requestBody = { user: userData };

      // Act
      const res = await request
        .post('/register')
        .type('form')
        .send(requestBody);
      const newUserExists = await User.exists({
        email: requestBody.user.email,
      });

      // Assert
      expect(res.status).toBe(302);
      expect(res.redirect).toBe(true);
      expect(newUserExists).toBe(true);
    });

    it('should not register a new user when the request data is invalid', async () => {
      // Arrange
      const userData = await factory.attrs('User', { email: 'invalidemail' });
      const requestBody = { user: userData };

      // Act
      const res = await request
        .post('/register')
        .type('form')
        .send(requestBody);

      // Assert
      expect(res.status).toBe(400);
    });
  });

  it('should not register a new user when the email already exists', async () => {
    // Arrange
    const existentUser = await factory.create('User');
    const newUserData = await factory.attrs('User', {
      email: existentUser.email,
    });
    const requestBody = { user: newUserData };

    // Act
    const res = await request.post('/register').type('form').send(requestBody);

    // Assert
    expect(res.status).toBe(400);
  });

  describe('Login', () => {
    it('should render login page', async () => {
      // Act
      const res = await request.get('/login');

      // Assert
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('html');
    });
  });
});
