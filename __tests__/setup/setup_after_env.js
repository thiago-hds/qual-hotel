require('dotenv').config();

const databaseHelper = require('../../src/utils/database');

beforeAll(() => {
  return databaseHelper.connect();
});

afterEach(() => {
  return databaseHelper.truncate();
});

afterAll(() => {
  return databaseHelper.disconnect();
});
