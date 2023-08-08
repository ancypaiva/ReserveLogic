const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const MoviesSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    others: {
      type: String,
    },
    year: {
      type: String,
    },
    image: {
      type: String,
      default: process.env.DEFAULT_IMG,
    },
    isDeleted: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    files: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

MoviesSchema.statics.checkIfAvailable = async (flag, value, excludeUserId) => {
  if (flag === 'name') {
    const name = value;
    /* eslint-disable-next-line no-use-before-define */
    const user = await Movies.findOne({ name, _id: { $ne: excludeUserId }, isDeleted: false });
    return !!user;
  }
  const description = value;
  /* eslint-disable-next-line no-use-before-define */
  const user = await Movies.findOne({ description, _id: { $ne: excludeUserId }, isDeleted: false });
  return !!user;
};

// add plugin that converts mongoose to json and pagination
MoviesSchema.plugin(toJSON);
MoviesSchema.plugin(paginate);

/**
 * @typedef User
 */
const Movies = mongoose.model('Movies', MoviesSchema);

module.exports = Movies;
