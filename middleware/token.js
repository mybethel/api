const jwt = require('jsonwebtoken');

module.exports = app => (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers.authorization;
  if (!token) return next();

  // Support for the authorization scheme in RFC2617. Currently only JWT is
  // supported and if a differenct scheme is sent the middleware aborts.
  token = token.match(/(\S+)\s+(\S+)/);
  if (!token || token[1].toLowerCase() !== 'jwt') return next();

  jwt.verify(token[2], app.config.security.jwtSecret, (err, decoded) => {
    if (err) return next();

    req.authorization = decoded;
    next();
  });
};
