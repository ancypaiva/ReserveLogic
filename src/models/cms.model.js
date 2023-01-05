/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const CmsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: Object,
      required: true,
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

CmsSchema.statics.checkIfAvailable = async (_flag, value, excludeCmsId) => {
  const name = value;
  /* eslint-disable-next-line no-use-before-define */
  const role = await Role.findOne({ name, _id: { $ne: excludeCmsId } });
  return !!role;
};

// add plugin that converts mongoose to json and pagination
CmsSchema.plugin(toJSON);
CmsSchema.plugin(paginate);

/**
 * @typedef Role
 */
const Role = mongoose.model('Cms', CmsSchema);
/* eslint-disable consistent-return */
module.exports = Role;
