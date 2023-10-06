const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const HotelsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    rooms: [
      {
        room_type: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    price: {
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
  },
  {
    timestamps: true,
  }
);

// To search for hotels
HotelsSchema.statics.checkIfAvailable = async (flag, value, excludeUserId) => {
  if (flag === 'name') {
    const name = value;
    /* eslint-disable-next-line no-use-before-define */
    const user = await Hotels.findOne({ name, _id: { $ne: excludeUserId }, isDeleted: false });
    return !!user;
  }
  const description = value;
  /* eslint-disable-next-line no-use-before-define */
  const user = await Hotels.findOne({ description, _id: { $ne: excludeUserId }, isDeleted: false });
  return !!user;
};

// add plugin that converts mongoose to json and pagination
HotelsSchema.plugin(toJSON);
HotelsSchema.plugin(paginate);

/**
 * @typedef User
 */
const Hotels = mongoose.model('Hotels', HotelsSchema);

module.exports = Hotels;
