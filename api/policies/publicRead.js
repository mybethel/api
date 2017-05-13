module.exports = (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD' && !req.authorization) {
    return res.unauthorized();
  }

  next();
};
