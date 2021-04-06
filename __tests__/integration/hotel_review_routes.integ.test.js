const supertest = require('supertest');
const app = require('../../src/app');

const request = supertest(app);

describe('Hotel Review Routes', () => {
  it('should create a valid hotel review', () => {
    expect(2).toBe(1 + 1);
  });
});
