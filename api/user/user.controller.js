const bcrypt = require('bcrypt');

module.exports = (router, app) => ({

  /**
   * Get the ministries for which a particular user is authorized to manage.
   * For users with `staff` level priveleges, a full list of all ministries will
   * be returned in order to allow masquerading as any ministry.
   * @param {ObjectID} req.params.id - The user ID to return ministries for.
   */
  '/:id/ministries': function(req, res) {
    app.model('user').findOne({ _id: req.params.id }).then(user => {
      if (!(user = user.toJSON())) {
        return res.unauthorized();
      }

      let query = {};
      if (user.permission !== 'staff') {
        let authorized = user.ministriesAuthorized || [];
        authorized.push(user.ministry);
        query = { _id: { $in: authorized }};
      }

      app.model('ministry').find(query)
        .select('_id name').sort('name').lean()
        .then(ministries => {
          res.ok(ministries);
        });
    });
  },

  /**
   * Deliver an authentication token for the user to query the API for protected
   * resources. Requires an existing, valid token or a username and password
   * pair in order to deliver a new token. Tokens are valid for one week.
   * Optionally, a ministry ID can be included to allow the user to masquerade
   * as a ministry other than their primary association.
   * @param {String} req.authorization - See the `token` middleware.
   * @param {String} req.body.email - The e-mail address of the user to login.
   * @param {String} req.body.password - The user password to validate.
   * @param {String} req.body.ministry - (optional) The ministry ID to use.
   */
  auth(req, res) {
    let hasToken = !!req.authorization;
    if (!hasToken && (!req.body.email || !req.body.password)) {
      return res.unauthorized();
    }

    let criteria = hasToken ? { _id: req.authorization.id } : { email: req.body.email };

    app.model('user').findOne(criteria).then(user => {
      if (!user) {
        return res.unauthorized();
      }

      // Allow the user to masquerade under a ministry other than their primary.
      // Requires the user to have staff permissions or to have the ministry ID
      // listed as authorized on their account.
      if (req.body.ministry) {
        let userObject = user.toJSON();
        if (userObject.permission !== 'staff' && userObject.ministriesAuthorized.indexOf(req.body.ministry) < 0) {
          return res.unauthorized();
        }

        user.ministry = req.body.ministry;
      }

      const token = app.token.issue(user);

      if (hasToken) return res.ok({ data: user, token });

      bcrypt.compare(req.body.password, user.password, (err, valid) => {
        if (err || !valid) return res.unauthorized();
        res.ok({ data: user, token });
      });
    });
  },

  create(req, res) {
    if (req.body.ministryName) {
      return app.model('ministry').create({
        name: req.body.ministryName,
      }).then(ministry => {
        req.body.ministry = ministry._id;
        req.body.permission = 'admin';
        return app.model('user').create(req.body);
      }).then(user => res.created(user))
        .catch(err => res.serverError(err));
    }

    app.model('user').create(req.body)
      .then(user => res.created(user))
      .catch(err => res.serverError(err));
  },

});
