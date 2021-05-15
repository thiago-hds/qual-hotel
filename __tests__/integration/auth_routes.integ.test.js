const supertest = require('supertest');
const faker = require('faker');

const User = require('../../src/models/user');
const app = require('../../src/app');
const factory = require('../factories');

const request = supertest(app);

describe('Authentication', () => {
  describe('GET /register', () => {
    it('should render register page', async () => {
      // Act
      const res = await request.get('/register');
      // Assert
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('html');
    });
  });

  describe('POST /register', () => {
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
      expect(newUserExists).toBe(true);
      expect(res.status).toBe(302);
      expect(res.redirect).toBe(true);
      expect(res.headers['location']).toMatch('/');
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

    it('should not register a new user when the email already exists', async () => {
      // Arrange
      const existentUser = await factory.create('User');
      const newUserData = await factory.attrs('User', {
        email: existentUser.email,
      });
      const requestBody = { user: newUserData };
      // Act
      const res = await request
        .post('/register')
        .type('form')
        .send(requestBody);
      // Assert
      expect(res.status).toBe(400);
    });
  });

  describe('GET /login', () => {
    it('should render login page', async () => {
      // Act
      const res = await request.get('/login');
      // Assert
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('html');
    });
  });

  describe('POST /login', () => {
    it('should login when the email and password match', async () => {
      // Arrange
      const password = faker.internet.password();
      const user = await factory.create('User', { password });
      const requestData = { email: user.email, password };
      // Act
      const res = await request.post('/login').type('form').send(requestData);
      // Assert
      expect(res.status).toBe(302);
      expect(res.redirect).toBe(true);
      expect(res.headers['location']).toMatch('/');
    });

    it("should not login when the email doesn't exist", async () => {
      // Arrange
      const userData = await factory.attrs('User');
      const requestData = {
        email: userData.email,
        password: userData.password,
      };
      // Act
      const res = await request.post('/login').type('form').send(requestData);
      // Assert
      expect(res.status).toBe(302);
      expect(res.redirect).toBe(true);
      expect(res.headers['location']).toMatch('/login');
    });

    it("should not login when the password doesn't match the email", async () => {
      // Arrange
      const user = await factory.create('User');
      const invalidPassword = faker.internet.password();
      const requestData = { email: user.email, password: invalidPassword };
      // Act
      const res = await request.post('/login').type('form').send(requestData);
      // Assert
      expect(res.status).toBe(302);
      expect(res.redirect).toBe(true);
      expect(res.headers['location']).toMatch('/login');
    });

    it('should redirect to original route after login', async () => {
      // Arrange
      const agent = supertest.agent(app);
      const originalUrl = '/hotels/new';
      await agent.get(originalUrl).expect(302).expect('Location', '/login');

      const password = faker.internet.password();
      const user = await factory.create('User', { password });
      const requestData = { email: user.email, password };

      // Act
      const res = await agent.post('/login').type('form').send(requestData);

      // Assert
      expect(res.status).toBe(302);
      expect(res.redirect).toBe(true);
      expect(res.headers['location']).toMatch(originalUrl);
    });
  });

  describe('GET /logout', () => {
    it('should logout when the user is authenticated', async () => {
      // Act
      const res = await request.get('/logout').send();
      // Assert
      expect(res.status).toBe(302);
      expect(res.redirect).toBe(true);
      expect(res.headers['location']).toMatch('/');
    });
  });
});
