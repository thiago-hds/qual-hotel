const supertest = require('supertest');
const User = require('../../src/models/user');
const app = require('../../src/app');

const request = supertest(app);

describe('auth routes', () => {
  it('should render register page', async () => {
    const res = await request.get('/register');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('html');
  });

  it('should register a new user with valid data', async () => {
    const requestBody = {
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@mail.com',
        password: '123123',
      },
    };

    const res = await request.post('/register').type('form').send(requestBody);
    const newUserExists = await User.exists({ email: requestBody.user.email });

    expect(res.status).toBe(302);
    expect(res.redirect).toBe(true);
    expect(newUserExists).toBe(true);
  });
});
