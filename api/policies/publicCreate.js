module.exports = (req, res, next) => {
  if (req.method !== 'POST' && !req.authorization) {
    return res.unauthorized();
  }

  next();
};
