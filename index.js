// When running in Production, New Relic is used for application performance
// monitoring. This will load and use the configuration file at `./newrelic.js`
if (process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
}

const Nautilus = require('@nautilus/web');
var server = new Nautilus({
  session: false,
  slash: false
});

server.start();
