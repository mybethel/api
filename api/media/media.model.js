const mime = require('mime');
const Mongoose = require('mongoose');

module.exports = {
  schema: {
    date: Date,
    description: String,
    filename: String,
    ministry: { type: Mongoose.Schema.Types.ObjectId, ref: 'Ministry' },
    mime: String,
    name: String,
    podcast: { type: Mongoose.Schema.Types.ObjectId, ref: 'Podcast' },
    size: Number,
    type: {
      type: String,
      enum: ['cloud', 'vimeo'],
    },
    uploading: Boolean,
    url: String
  },
  options: {
    collection: 'podcastmedia',
    toJSON: {
      transform(doc, ret, options) {
        ret.size = ret.size || 0;
        ret.url = doc.downloadUrl;
        ret.mime = ret.mime || mime.lookup(ret.url);
        return ret;
      }
    }
  },
  virtuals: {
    downloadUrl() {
      if (!this.url) return;
      return `https://my.bethel.io/podcastmedia/download/${this._id}.${this.url.split('?').shift().split('.').pop()}`;
    },
  },
};
