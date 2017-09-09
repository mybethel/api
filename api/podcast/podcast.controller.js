module.exports = (router, app) => ({

  '/:id/media': function(req, res) {
    let query = app.blueprint.find('media', { podcast: req.params.id }, req);

    query.then(results => app.blueprint.format(results, query, req))
      .then(formatted => res.ok(formatted))
      .catch(err => res.serverError(err));
  },

  '/:id/performance': function(req, res) {
    let subscribers = app.performance.query('count', {
      event_collection: 'podcast',
      filters: [{
        property_name: 'podcast',
        operator: 'eq',
        property_value: req.params.id,
      }],
      interval: 'weekly',
      timeframe: 'this_12_weeks',
    });

    Promise.all([
      app.model('media').find({ podcast: req.params.id }).count(),
    ]).then(results => {
      res.ok({
        podcast: req.params.id,
        episodes: results[0],
        subscribers,
      });
    });
  },

});
