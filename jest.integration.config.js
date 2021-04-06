const config = require('./jest.config');

// The glob patterns Jest uses to detect test files
config.testMatch = ['**/__tests__/**/*.integ.test.js']; //Overriding testMatch option

console.log('RUNNING INTEGRATION TESTS');
module.exports = config;
