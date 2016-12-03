const mime = require('mime');
const Mongoose = require('mongoose');

module.exports = {
  schema: {
    name: String,
    podcast: { type: Mongoose.Schema.Types.ObjectId, ref: 'Podcast' },
    size: Number,
    url: String
  },
  options: {
    collection: 'podcastmedia',
    toJSON: {
      transform(doc, ret, options) {
        ret.size = ret.size || 0;
        ret.type = mime.lookup(ret.url);
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
