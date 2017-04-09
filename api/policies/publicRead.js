module.exports = (req, res, next) => {
  if (req.method !== 'GET' && !req.authorization) {
    return res.unauthorized();
  }

  next();
};
