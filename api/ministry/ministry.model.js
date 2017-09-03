module.exports = {
  schema: {
    description: String,
    email: {
      lowercase: true,
      trim: true,
      type: String,
    },
    name: String,
    url: String,
  },
  options: {
    timestamps: true,
  },
};
