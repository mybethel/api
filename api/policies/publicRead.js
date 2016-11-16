module.exports = (req, res, next) => {
  if (req.method !== 'GET' && !req.query.access_token) {
    return res.unauthorized();
  }

  next();
};
