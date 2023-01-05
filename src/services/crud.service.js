/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createEntry = async (userBody, model) => {
  const Model = require(`../models/${model}.model.js`);
  const checkFlag = 'email'; // email or phone
  const checkParam = checkFlag === 'phone' ? userBody.phone : userBody.email;
  if (await Model.checkIfAvailable(checkFlag, checkParam)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `${checkFlag} already taken`);
  }
  const checkFlag1 = 'name'; // email or phone
  const checkParam1 = userBody.name;
  if (await Model.checkIfAvailable(checkFlag1, checkParam1)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `${checkFlag1} already taken`);
  }
  return Model.create(userBody);
};

/**
 * Query for Entries
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryEntries = async (filter, options, model) => {
  // eslint-disable-next-line import/no-dynamic-require
  // eslint-disable-next-line global-require
  const Model = require(`../models/${model}.model.js`);
  const entries = await Model.paginate(filter, options);
  return entries;
};

/**
 * Get Entry by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getEntryById = async (id, model) => {
  const User = require(`../models/${model}.model.js`);
  return User.findById(id);
};

/**
 * Update entry by id
 * @param {ObjectId} entryId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateEntryById = async (entryId, updateBody, model) => {
  const Model = require(`../models/${model}.model.js`);
  const entry = await getEntryById(entryId);
  if (!entry) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const checkFlag = 'email'; // email or phone
  const checkParam = checkFlag === 'phone' ? updateBody.phone : updateBody.email;
  if (checkParam && (await Model.checkIfAvailable(checkParam, entryId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, `${checkFlag} already taken`);
  }
  Object.assign(entry, updateBody);
  await entry.save();
  return entry;
};

/**
 * Delete entry by id
 * @param {ObjectId} entryId
 * @returns {Promise<User>}
 */
const deleteEntryById = async (entryId) => {
  const entry = await updateEntryById(entryId);
  if (!entry) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Entry not found');
  }
  await entry.remove();
  return entry;
};

module.exports = {
  createEntry,
  queryEntries,
  getEntryById,
  updateEntryById,
  deleteEntryById,
};
