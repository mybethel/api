let stripe = require('stripe');

module.exports = app => {
  return stripe(app.config.stripe.secret);
};
