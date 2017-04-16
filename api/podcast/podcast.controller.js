module.exports = (router, app) => ({

  '/:id/media': function(req, res) {
    let query = app.blueprint.find('media', { podcast: req.params.id }, req);

    query.then(results => app.blueprint.format(results, query, req))
      .then(formatted => res.json(formatted));
  },

  '/:id/stats': function(req, res) {
    let subscribers = app.performance.query('count', {
      event_collection: 'podcast',
      interval: 'weekly',
      timeframe: 'this_12_weeks',
    });

    // @TODO: Anything with a graph is more performant if queries with an XHR
    // request directly on the frontend. In the future, rather than running the
    // query in the API we should simply return a pre-signed JSONP request.
    Promise.all([
      function queryAnalytics() {
        return new Promise((resolve, reject) => {
          app.performance.client.run(subscribers, function(err, response) {
            if (err) return reject(err);
            resolve(response.result);
          });
        })
      }(),
      app.model('media').find({ podcast: req.params.id }).count(),
    ]).then(results => {
      // Subscriber count is the total number of subscribers as counted last
      // week. Numbers for the current week are too volatile as we only have a
      // partial representation of the entire week.
      let subscribers = results[0].reverse()[1] || '0';
      res.ok({
        podcast: req.params.id,
        episodes: results[1],
        graph: results[0],
        subscribers,
      });
    });
  },

});
