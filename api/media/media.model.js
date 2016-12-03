const Mongoose = require('mongoose');

module.exports = {
  schema: {
    name: String,
    podcast: { type: Mongoose.Schema.Types.ObjectId, ref: 'Podcast' },
    url: String
  },
  options: {
    collection: 'podcastmedia',
    toJSON: {
      transform(doc, ret, options) {
        ret.url = doc.downloadUrl;
        return ret;
      }
    }
  },
  setup(schema) {
    schema.virtual('downloadUrl').get(function() {
      return `https://my.bethel.io/podcastmedia/download/${this._id}.${this.url.split('.').pop()}`;
    });
  }
};
