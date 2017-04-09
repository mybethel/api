const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Mongoose = require('mongoose');

module.exports = {
  middleware: {
    preSave(next) {
      if (!this.isModified('password')) return next();
      bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        next(err);
      });
    },
  },
  schema: {
    email: {
      index: { unique: true },
      lowercase: true,
      required: true,
      trim: true,
      type: String,
    },
    lastLogin: Date,
    ministriesAuthorized: [Mongoose.Schema.Types.ObjectId],
    name: String,
    isLocket: Boolean,
    password: String,
  },
  options: {
    toJSON: {
      transform(doc, ret, options) {
        delete ret.password;
        return ret;
      },
      virtuals: true,
    },
  },
  virtuals: {
    avatar() {
      const hash = crypto.createHash('md5').update(this.email).digest('hex');
      return `https://gravatar.com/avatar/${hash}.png?d=mm`;
    },
  },
};
