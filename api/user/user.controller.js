const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (router, app) => ({

  // If there is a valid token, re-issue token with an updated expiration time.
  // If no token, check for valid username and password and then issue a new token.
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

      const token = jwt.sign({
        id: user._id,
        permission: user.permission,
      }, app.config.security.jwtSecret, {
        expiresIn: '7d',
      });

      if (hasToken) return res.ok({ token });

      bcrypt.compare(req.body.password, user.password, (err, valid) => {
        if (err || !valid) return res.unauthorized();
        res.ok({ token });
      });
    });
  },
});
