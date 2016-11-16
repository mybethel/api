const Mongoose = require('mongoose');

module.exports = {
  schema: {
    name: String,
    podcast: { type: Mongoose.Schema.Types.ObjectId, ref: 'Podcast' }
  },
  options: {
    collection: 'podcastmedia'
  }
};
