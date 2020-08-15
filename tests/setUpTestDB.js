const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const config = require('../src/config/config');

const setupTestDB = () => {
  const mongod = new MongoMemoryServer();

  beforeAll(async () => {
    const uri = await mongod.getUri();

    await mongoose.connect(uri, config.mongoose.options);
  });

  beforeEach(async () => {
    await Promise.all(Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany()));
  });

  afterAll(async () => {
    await mongod.stop();
    await mongoose.disconnect();
  });
};

module.exports = setupTestDB;
