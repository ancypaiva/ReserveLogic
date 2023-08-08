const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const NotificationsSchema = mongoose.Schema(
  {
    type: {
      type: String,
    },
    type_id: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
    },
    read_status: {
      type: Boolean,
      enum: [true, false],
      default: false,
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

// add plugin that converts mongoose to json and pagination
NotificationsSchema.plugin(toJSON);
NotificationsSchema.plugin(paginate);

/**
 * @typedef User
 */
const Notifications = mongoose.model('Notifications', NotificationsSchema);

module.exports = Notifications;
