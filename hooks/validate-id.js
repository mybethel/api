const ObjectID = require('mongodb').ObjectID;

module.exports = function(app) {
  app.param('id', (req, res, next, id) => {
    if (ObjectID.isValid(id) || id.indexOf('.') > 0) return next();
    res.badRequest(`id supplied value "${id}" is invalid`);
  });
};
