const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const settingsSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },
    values: {
      type: Object,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      default: 'https://boilerplate-armia.s3.amazonaws.com/downloads/r512ndohjf0.png-1653567387848',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json and pagination
settingsSchema.plugin(toJSON);
settingsSchema.plugin(paginate);

/**
 * @typedef Settings
 */
const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
