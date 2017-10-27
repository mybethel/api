const mime = require('mime');
const Mongoose = require('mongoose');

module.exports = {
  schema: {
    date: Date,
    deleted: Boolean,
    description: String,
    duration: Number,
    filename: String,
    ministry: { type: Mongoose.Schema.Types.ObjectId, ref: 'Ministry' },
    mime: String,
    name: String,
    podcast: { type: Mongoose.Schema.Types.ObjectId, ref: 'Podcast' },
    reference: String,
    referenceId: Number,
    size: Number,
    tags: [String],
    thumbnail: String,
    type: {
      type: String,
      enum: ['cloud', 'vimeo'],
    },
    uploading: Boolean,
    url: String,
    uuid: String,
    variants: Mongoose.Schema.Types.Mixed,
  },
  options: {
    collection: 'podcastmedia',
    timestamps: true,
    toJSON: {
      transform(doc, ret, options) {
        ret.size = ret.size || 0;
        ret.url = doc.downloadUrl;
        ret.mime = ret.mime || ret.url && mime.lookup(ret.url);
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
