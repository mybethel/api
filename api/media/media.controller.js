module.exports = (router, app) => ({

  // Update media using it's UUID rather than it's Mongo ID. The UUID is used as
  // a short or human readable version of the ID. Additionally, for media that
  // is sync'd from an off-site provider (such as Vimeo) the UUID represents the
  // external ID. This endpoint acts as an "upsert" method which is used during
  // the sync operation. If an entity does not exist at the specified UUID the
  // payload will be used for a create action so long as it passes validation.
  '/uuid/:id': function(req, res) {
    if (req.method !== 'PUT') return res.badRequest();

    res.ok(req.params.id);
  }

});
