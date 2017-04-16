const Keen = require('keen-js');
module.exports = app => {
  // Ensure that visitor IP addresses are not the reverse proxy to ensure we get
  // the most accurate data before logging to Keen.
  app.enable('trust proxy');

  let client = new Keen(app.config.performance);
  return {
    client,
    query(type, config) {
      return new Keen.Query(type, config);
    }
  };
};
