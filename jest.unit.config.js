const config = require('./jest.config');
config.testMatch = ['**/__tests__/**/*.unit.test.js']; //Overriding testMatch option
console.log('RUNNING UNIT TESTS');
module.exports = config;
