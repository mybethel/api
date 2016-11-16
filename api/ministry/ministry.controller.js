module.exports = (router, app) => ({

  '/:id/podcast': function(req, res) {
    app.api.model.find('podcast', { podcast: req.params.id }, req)
      .then(results => {
        res.json(results);
      });
  }

});
