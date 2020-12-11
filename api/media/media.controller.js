const mime = require('mime-types');

module.exports = (router, app) => ({

  /**
   * Create a new media object in preparation for uploading. Only the file
   * metadata is required, and a pre-signed S3 upload URL will be returned for
   * the client to complete the request. Once an upload has finished it's the
   * responsibility of the client to update the newly created Media object and
   * switch the `uploading` flag to `false`.
   * @param {Object} req.body - Metadata for the media being uploaded.
   * @param {String} req.body.filename - The original filename.
   * @param {String} req.body.ministry - The ministry ID to associate the media.
   * @param {String} req.body.mime - The mime-type of the file being uploaded.
   * This *must* match the file being uploaded otherwise S3 will reject. If a
   * mime-type is not available, the original filename is used.
   */
  create(req, res) {
    if (!req.body.ministry) return res.badRequest('ministry required');

    if (!req.body.mime && req.body.filename) {
      req.body.mime = mime.getType(req.body.filename);
    }

    app.model('media').findOrCreate(req.body).then(media => {
      media.filename = `${media._id}.${mime.getExtension(media.mime)}`;

      let key = ['media', req.body.ministry];
      if (req.body.podcast) {
        key.push(req.body.podcast);
      }
      key.push(media.filename);

      let params = {
        Bucket: app.config.aws.bucket,
        Key: key.join('/'),
        Expires: 3600,
        ContentType: req.body.mime,
      };

      app.aws.s3.getSignedUrl('putObject', params, (err, url) => {
        if (err) return res.serverError(err);

        return res[media.$__.inserting && 'created' || 'ok']({ data: media, uploadUrl: url });
      });
    }).catch(err => res.serverError(err));
  },

  /**
   * Update media using it's UUID rather than it's Mongo ID. The UUID is used as
   * a short or human readable version of the ID. Additionally, for media that
   * is sync'd from an off-site provider (such as Vimeo) the UUID represents the
   * external ID. This endpoint acts as an "upsert" method which is used during
   * the sync operation. If an entity does not exist at the specified UUID the
   * payload will be used for a create action so long as it passes validation.
   */
  '/uuid/:id': function(req, res) {
    if (req.method !== 'PUT') return res.badRequest();

    res.ok(req.params.id);
  }

});
