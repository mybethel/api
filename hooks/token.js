const jwt = require('jsonwebtoken');

module.exports = app => ({
  issue(user) {
    return jwt.sign({
      id: user._id,
      ministry: user.ministry,
      permission: user.permission,
    }, app.config.security.jwtSecret, {
      expiresIn: '7d',
    });
  }
});
