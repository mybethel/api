const Mongoose = require('mongoose');

module.exports = {
  schema: {
    customerId: String,
    ministry: { type: Mongoose.Schema.Types.ObjectId, ref: 'Ministry' },
  },
};
