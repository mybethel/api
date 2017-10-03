const Mongoose = require('mongoose');

module.exports = {
  schema: {
    host: Array,
    ministry: { type: Mongoose.Schema.Types.ObjectId, ref: 'Ministry' },
    navigation: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Content' }],
    theme: String,
    config: Mongoose.Schema.Types.Mixed,
  },
};
