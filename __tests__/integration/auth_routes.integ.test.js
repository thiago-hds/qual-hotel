const supertest = require('supertest');
const faker = require('faker');

const User = require('../../src/models/user');
const app = require('../../src/app');
const factory = require('../../src/libs/factories');

const request = supertest(app);

describe('Authentication', () => {
  describe('GET /register', () => {
    it('should return status 200 (ok)', async () => {
      // Act
      const res = await request.get('/register');
      // Assert
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('html');
    });
  });

  describe('POST /register', () => {
    it('should return status 303 (see other) and redirect to / when the request data is valid', async () => {
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
      expect(res.status).toBe(303);
      expect(res.redirect).toBe(true);
      expect(res.headers['location']).toMatch('/');
      expect(newUserExists).toBe(true);
    });

    it('should return status 400 (bad request) when the request data is invalid', async () => {
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

    it('should return status 400 (bad request) when the email already exists', async () => {
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
    it('should return status 200 (ok)', async () => {
      // Act
      const res = await request.get('/login');
      // Assert
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('html');
    });
  });

  describe('POST /login', () => {
    it('should return status 303 (see other) and redirect to / when the email and password match', async () => {
      // Arrange
      const password = faker.internet.password();
      const user = await factory.create('User', { password });
      const requestData = { email: user.email, password };
      // Act
      const res = await request.post('/login').type('form').send(requestData);
      // Assert
      expect(res.status).toBe(303);
      expect(res.redirect).toBe(true);
      expect(res.headers['location']).toMatch('/');
    });

    it("should return status 302 (found) and redirect to /login when the email doesn't exist", async () => {
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

    it("should return status 302 (found) and redirect to /login when the password doesn't match the email", async () => {
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

    it('should return status 303 (see other) and redirect to original route after login', async () => {
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
      expect(res.status).toBe(303);
      expect(res.redirect).toBe(true);
      expect(res.headers['location']).toMatch(originalUrl);
    });
  });

  describe('GET /logout', () => {
    it('should return status 302 (found) and redirect to /', async () => {
      // Act
      const res = await request.get('/logout').send();
      // Assert
      expect(res.status).toBe(302);
      expect(res.redirect).toBe(true);
      expect(res.headers['location']).toMatch('/');
    });

    // TODO testar se destrói sessão de um usuário autenticado
  });
});
