const Mongoose = require('mongoose');

module.exports = {
  schema: {
    name: {
      type: String,
      required: true,
    },
    default: Boolean,
    description: String,
    address: {
      type: String,
      required: true,
    },
    loc: Array,
    times: String,
    ministry: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'Ministry',
    },
  },
};
