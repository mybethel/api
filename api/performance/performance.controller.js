module.exports = (router, app) => ({

  /**
   * Send analytics to Keen.io for storage.
   * @param {Object} req.body - The entire analytic object to be sent.
   * @param {String} req.body.collection - A collection to store the data.
   */
  track(req, res) {
    if (req.method !== 'POST' || !req.body.collection) return res.badRequest();
    let collection = req.body.collection;
    delete req.body.collection;

    // Analytics are sent behind the scenes and a `200` response is always sent.
    // This is done to keep the API responsive and prevent upstream issues from
    // affecting the usability of end-user applications.
    app.analytics.addEvent(collection, req.body, err => {
      if (err) app.log.error(err);
    });

    res.ok();
  },

});
