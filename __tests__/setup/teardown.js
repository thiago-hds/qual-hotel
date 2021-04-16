const MemoryDatabaseServer = require('../lib/memory_database_server');

module.exports = async () => {
  await MemoryDatabaseServer.stop();
};
