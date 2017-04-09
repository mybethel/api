const Nautilus = require('@nautilus/web');
let api = new Nautilus({
  log: {
    level: 'error',
  },
  session: false,
  slash: false,
  connections: {
    mongo: { url: process.env.DB_TEST || 'mongodb://127.0.0.1:27017/bethel-test' },
  },
});

before(function(done) {
  this.timeout(30000);
  api.start(function() {
    if (api.app.mongo.connection.readyState === 1) {
      return done();
    }

    api.app.mongo.connection.once('connected', done);
  });
});
after(done => api.stop(done));

module.exports = api.app;
