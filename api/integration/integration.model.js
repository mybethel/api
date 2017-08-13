const Mongoose = require('mongoose');

module.exports = {
  schema: {
    accessToken: String,
    expires: String,
    link: String,
    ministry: { type: Mongoose.Schema.Types.ObjectId, ref: 'Ministry' },
    name: String,
    picture: String,
    provider: String,
    refreshToken: String,
    user: String,
  },
  options: {
    collection: 'service',
  },
};
