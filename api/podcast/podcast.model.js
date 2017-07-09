const Mongoose = require('mongoose');

module.exports = {
  schema: {
    name: String,
    image: String,
    ministry: { type: Mongoose.Schema.Types.ObjectId, ref: 'Ministry' },
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
};
