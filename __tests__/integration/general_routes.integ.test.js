const supertest = require('supertest');
const app = require('../../src/app');

const request = supertest(app);

describe('General Routes', () => {
  it('should return status 404 (not found) for a invalid route', async () => {
    // Act
    const res = await request.get('/invalid');

    // Assert
    expect(res.status).toBe(404);
  });
});
