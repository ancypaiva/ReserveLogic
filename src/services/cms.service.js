const { Cms } = require('../models');
/**
 * Get cms by name
 * @param {string} email
 * @returns {Promise<User>}
 */
const getCmsByName = async (name) => {
  return Cms.findOne({ name });
};

/**
 * Update content by name
 * @param {string} name
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateContentByName = async (name, updateBody) => {
  const doc = await Cms.findOneAndUpdate({ name: updateBody.name }, updateBody, { upsert: true });
  return doc;
};

module.exports = { getCmsByName, updateContentByName };
