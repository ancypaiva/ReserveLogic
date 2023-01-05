/* eslint-disable no-underscore-dangle */
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Role, User } = require('../models');
const rolesSearchByFields = require('../config/constants');
const { deleteCacheData, setCacheDataWithExpiryAsync } = require('../utils/redisCache');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createRole = async (userBody) => {
  return Role.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRoles = async (filter, options) => {
  const roles = await Role.paginate(filter, options, rolesSearchByFields.rolesSearchByFields);
  return roles;
};

/**
 * Get role by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getRoleById = async (id) => {
  return Role.findById(id);
};

/**
 * Update role by id
 * @param {ObjectId} roleId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateRoleById = async (roleId, updateBody) => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  const checkFlag = 'name';
  const checkParam = updateBody.name;
  if (checkParam && (await Role.checkIfAvailable(checkParam, roleId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, `${checkFlag} already taken`);
  }
  if (updateBody.defaultRole) {
    await Role.updateMany({ _id: { $nin: [role._id] } }, { defaultRole: false }).exec();
  }
  Object.assign(role, updateBody);
  role.save().then((updatedrole) => {
    if (updateBody.defaultRole) {
      deleteCacheData('defaultRole');
      setCacheDataWithExpiryAsync('defaultRole', updatedrole._id.toString());
    }
  });

  return role;
};

const checkDelete = async (roleId) => {
  const existingUsers = await User.findOne({ role: roleId, isDeleted: false });
  return !(existingUsers && existingUsers.name.length);
};
const getDefaultRole = async () => {
  const defaultrole = await Role.findOne({ defaultRole: true }).lean();
  setCacheDataWithExpiryAsync('defaultRole', defaultrole._id);
  return defaultrole._id;
};

/**
 * Delete role by id
 * @param {ObjectId} roleId
 * @returns {Promise<User>}
 */
const deleteRoleById = async (roleId) => {
  const check = await checkDelete(roleId);
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  if (!check) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User exists for this role!');
  }
  role.isDeleted = true;
  await role.save();
  return role;
};

const getDataSselect = async () => {
  const roles = await Role.find({ isDeleted: false }).exec();
  const selectData = [];
  roles.forEach((role) => {
    selectData.push({ value: role._id, label: role.name });
  });

  return { selectdata: selectData };
};

module.exports = { createRole, queryRoles, getRoleById, updateRoleById, deleteRoleById, getDataSselect, getDefaultRole };
