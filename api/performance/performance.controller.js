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

    let addons = [];

    // If the IP address specified is in IPv6 "compatiblity" mode convert to
    // the standard IPv4 version so Keen can correctly parse the address.
    if (req.body.ip_address || req.ip) {
      req.body.ip_address = (req.body.ip_address || req.ip).replace('::ffff:', '');
      addons.push({
        name: 'keen:ip_to_geo',
        input: { ip: 'ip_address' },
        output: 'ip_geo_info',
      });
    }

    if (req.body.user_agent) {
      addons.push({
        name: 'keen:ua_parser',
        input: { ua_string: 'user_agent' },
        output: 'parsed_user_agent',
      });
    }

    req.body.keen = { addons };

    // Analytics are sent behind the scenes and a `200` response is always sent.
    // This is done to keep the API responsive and prevent upstream issues from
    // affecting the usability of end-user applications.
    app.performance.client.addEvent(collection, req.body, err => {
      if (err) app.log.error(err);
    });

    res.ok();
  },

});
