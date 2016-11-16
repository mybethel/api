var config = {
  mongo: {
    url: process.env.DB_MONGO || 'mongodb://localhost:32768'
  }
};

if (typeof process.env.DB_MONGO !== 'undefined') {
  config.mongo.options = {
    mongos: {
      ssl: Boolean(process.env.DB_MONGO),
      sslValidate: false
    }
  };
}

module.exports = config;
