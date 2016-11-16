const Mongoose = require('mongoose');

module.exports = {
  schema: {
    name: String,
    ministry: { type: Mongoose.Schema.Types.ObjectId, ref: 'Ministry' }
  }
};
