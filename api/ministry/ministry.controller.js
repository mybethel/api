module.exports = (router, app) => ({

  '/:id/podcast': function(req, res) {
    let query = app.blueprint.find('podcast', { podcast: req.params.id }, req);

    query.then(results => app.blueprint.format(results, query, req))
      .then(formatted => res.json(formatted));
  }

});
