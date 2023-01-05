/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const RoleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    permissions: {
      type: Object,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    defaultRole: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

RoleSchema.statics.checkIfAvailable = async (_flag, value, excludeRoleId) => {
  const name = value;
  /* eslint-disable-next-line no-use-before-define */
  const role = await Role.findOne({ name, _id: { $ne: excludeRoleId }, isDeleted: false });
  return !!role;
};

// add plugin that converts mongoose to json and pagination
RoleSchema.plugin(toJSON);
RoleSchema.plugin(paginate);

/**
 * @typedef Role
 */
const Role = mongoose.model('Roles', RoleSchema);
/* eslint-disable consistent-return */
module.exports = Role;
