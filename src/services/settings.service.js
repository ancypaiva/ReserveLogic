const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Settings } = require('../models');

/**
 * Query for settingss
 * @returns {Promise<QueryResult>}
 */
const getSettings = async () => {
  const settings = await Settings.find({ isDeleted: false });
  return settings;
};

/**
 * Get settings by id
 * @param {ObjectId} id
 * @returns {Promise<Settings>}
 */
const getSettingsByType = async (type) => {
  return Settings.findOne({ type });
};

/**
 * Update settings by type
 * @param {String} type
 * @param {Object} updateBody
 * @returns {Promise<Settings>}
 */
const updateSettingsByType = async (type, updateBody) => {
  const settings = await getSettingsByType(type);
  if (!settings) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Settings not found');
  }
  Object.assign(settings, updateBody);
  await settings.save();
  return settings;
};

module.exports = {
  getSettings,
  updateSettingsByType,
};
