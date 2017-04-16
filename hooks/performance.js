const Keen = require('keen-js');
module.exports = app => {
  // Ensure that visitor IP addresses are not the reverse proxy to ensure we get
  // the most accurate data before logging to Keen.
  app.enable('trust proxy');

  try {
    return new Keen(app.config.performance);
  } catch(err) {
    app.log.warn('Keen was unable to initialize', err);
  }
};
