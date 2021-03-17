const request = require('supertest');

const appController = require('../../src/app');
const Hotel = require('../../src/models/hotel');

describe('Hotel Routes', () => {
  it('should render a hotel index page', async () => {
    const res = await request(appController.appInstance).get('/hotels');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('html');
  });

  it('should render a hotel show page', async () => {
    const hotel = Hotel({ name: 'Grand Hotel Budapest' });
    await hotel.save();

    const res = await request(appController.appInstance).get(
      `/hotels/show/${hotel._id}`
    );

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('html');
    expect(res.text).toMatch(hotel.name);
  });

  afterAll(() => {
    appController.closeDatabaseConnection();
  });
});
