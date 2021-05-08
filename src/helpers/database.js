const mongoose = require('mongoose');

const connect = async () => {
  if (!mongoose.connection.readyState) {
    const mongoURL =
      process.env.NODE_ENV === 'test'
        ? global.__DB_URL__
        : process.env.DATABASE_CONNECTION_URI;

    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  }
};

const truncate = async () => {
  if (mongoose.connection.readyState) {
    const { collections } = mongoose.connection;

    const promises = Object.keys(collections).map((collection) =>
      mongoose.connection.collection(collection).deleteMany({})
    );
    await Promise.all(promises);
  }
};

const disconnect = async () => {
  if (mongoose.connection.readyState) {
    await mongoose.disconnect();
  }
};

module.exports = {
  connect,
  truncate,
  disconnect,
};
