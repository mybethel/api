const Mongoose = require('mongoose');

module.exports = {
  schema: {
    body: String,
    children: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Content' }],
    layout: String,
    site: { type: Mongoose.Schema.Types.ObjectId, ref: 'Site' },
    slug: String,
    title: String,
  },
};
