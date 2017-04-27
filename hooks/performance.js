const Keen = require('keen-js');
const qs = require('qs');

module.exports = app => {
  // Ensure that visitor IP addresses are not the reverse proxy to ensure we get
  // the most accurate data before logging to Keen.
  app.enable('trust proxy');

  let client = new Keen(app.config.performance);
  return {
    client,
    query(type, config) {
      let endpoint = `projects/${app.config.performance.projectId}/queries/${type}`;
      config['api_key'] = app.config.performance.readKey;
      config = qs.stringify(config);
      return `https://api.keen.io/3.0/${endpoint}?${config}`;
    }
  };
};
