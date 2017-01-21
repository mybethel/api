module.exports = (router, app) => ({

  '/:id/media': function(req, res) {
    let query = app.blueprint.find('media', { podcast: req.params.id }, req);

    query.then(results => app.blueprint.format(results, query, req))
      .then(formatted => res.json(formatted));
  }

});
