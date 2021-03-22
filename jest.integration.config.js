const config = require('./jest.config');
config.testMatch = ['**/__tests__/**/*.integ.test.js']; //Overriding testMatch option
console.log('RUNNING INTEGRATION TESTS');
module.exports = config;
