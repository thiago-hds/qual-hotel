const MemoryDatabaseServer = require('../../src/lib/memory_database_server');

module.exports = async () => {
  await MemoryDatabaseServer.start();
};
