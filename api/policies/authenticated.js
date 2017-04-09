module.exports = (req, res, next) => {
  if (!req.authorization || !req.authorization.permission) {
    return res.unauthorized();
  }

  next();
};
