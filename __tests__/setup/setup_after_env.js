require('dotenv').config();

const databaseHelper = require('../../src/utils/database');

beforeAll(() => {
  return databaseHelper.connect();
});

beforeEach(() => {
  return databaseHelper.truncate();
});

afterAll(() => {
  return databaseHelper.disconnect();
});
