const request = require('supertest');

const appController = require('../../src/app');
const Hotel = require('../../src/models/hotel');

describe('Hotel Routes', () => {
  it('should render hotel index page', async () => {
    const res = await request(appController.appInstance).get('/hotels');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('html');
  });

  it('should render a hotel show page when hotel id is valid', async () => {
    const hotel = Hotel({ name: 'Grand Hotel Budapest' });
    await hotel.save();

    const res = await request(appController.appInstance).get(
      `/hotels/${hotel._id}`
    );

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('html');
    expect(res.text).toMatch(hotel.name);
  });

  // it('should not render a hotel show page when hotel id is invalid', async () => {
  //   const hotelId = '1234';
  //   const res = await request(appController.appInstance).get(
  //     `/hotels/${hotelId}`
  //   );

  //   expect(res.status).toBe(404);
  // });

  it('should render new hotel page', async () => {
    const res = await request(appController.appInstance).get('/hotels/new');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('html');
  });

  it('should save a new hotel', async () => {
    const res = await request(appController.appInstance).post('/hotels').send({
      name: 'NewHotel',
      location: 'Belo Horizonte - MG',
    });
    const newHotelExists = await Hotel.exists({ name: 'NewHotel' });

    expect(res.status).toBe(302);
    expect(res.redirect).toBe(true);
    expect(newHotelExists).toBe(true);
  });

  it('should render edit hotel page', async () => {
    const hotel = Hotel({ name: 'Grand Hotel Budapest' });
    await hotel.save();

    const res = await request(appController.appInstance).get(
      `/hotels/${hotel._id}/edit`
    );
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('html');
  });

  // it('should not render a hotel edit page when hotel id is invalid', async () => {
  //   const hotelId = '1234';
  //   const res = await request(appController.appInstance).get(
  //     `/hotels/${hotelId}/edit`
  //   );

  //   expect(res.status).toBe(404);
  // });

  it('should edit a hotel', async () => {
    const hotel = Hotel({ name: 'Grand Hotel Budapest' });
    await hotel.save();

    hotel.name = 'New Grand Hotel Budapest';

    const res = await request(appController.appInstance)
      .put(`/hotels/${hotel._id}`)
      .send({ hotel });

    expect(res.status).toBe(302);
    expect(res.redirect).toBe(true);
  });

  it('should delete a hotel', async () => {
    const hotel = Hotel({ name: 'Grand Hotel Budapest' });
    await hotel.save();

    const res = await request(appController.appInstance).delete(
      `/hotels/${hotel._id}`
    );

    const hotelExists = await Hotel.exists({ _id: hotel._id });

    expect(res.status).toBe(302);
    expect(res.redirect).toBe(true);
    expect(hotelExists).toBe(false);
  });

  afterAll(() => {
    appController.closeDatabaseConnection();
  });
});
