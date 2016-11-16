module.exports = (router, app) => ({

  '/:id/media': function(req, res) {
    app.api.model.find('media', { podcast: req.params.id }, req)
      .then(results => {
        res.json(results);
      });
  }

});
