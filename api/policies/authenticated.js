module.exports = (req, res, next) => {
  if (!req.authorization) {
    return res.unauthorized();
  }

  next();
};
