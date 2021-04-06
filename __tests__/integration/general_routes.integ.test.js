const supertest = require('supertest');
const app = require('../../src/app');

const request = supertest(app);

describe('General Routes', () => {
  it('should return 404 error for a invalid route', async () => {
    const res = await request.get('/invalid');

    expect(res.status).toBe(404);
  });
});
