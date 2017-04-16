const Keen = require('keen-js');
module.exports = app => {
  try {
    return new Keen(app.config.performance);
  } catch(err) {
    app.log.warn('Keen was unable to initialize', err);
  }
};
