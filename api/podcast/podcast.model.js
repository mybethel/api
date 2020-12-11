const differenceInHours = require('date-fns/differenceInHours');
const Mongoose = require('mongoose');

module.exports = app => ({
  middleware: {
    // For podcasts which sync with Vimeo, the sync is run every 6 hours when
    // the podcast is requested. This preserves resources for active podcasts.
    postFindOne(doc) {
      if (!doc || doc.source !== 2) return;
      if (doc.lastSync && differenceInHours(Date.now(), doc.lastSync) < 6) return;
      app.vimeoSync.run(doc);
    },
  },
  schema: {
    deleted: Boolean,
    description: String,
    image: String,
    lastSync: Date,
    ministry: { type: Mongoose.Schema.Types.ObjectId, ref: 'Ministry' },
    name: String,
    source: Number,
    sourceMeta: [String],
    storage: Number,
    service: { type: Mongoose.Schema.Types.ObjectId, ref: 'Integration' },
  },
  options: {
    timestamps: true,
    toJSON: {
      transform(doc, ret, options) {
        ret.image = doc.imageUrl;
        delete ret.temporaryImage;
        return ret;
      }
    }
  },
  virtuals: {
    imageUrl() {
      const cdnSettings = '?crop=faces&fit=crop&w=1400&h=1400';
      const image = this.image || 'DefaultPodcaster.png';
      return `https://images.bethel.io/images/${image}${cdnSettings}&modified=${this.updatedAt.getTime()}`;
    },
  },
});
