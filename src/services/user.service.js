/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-syntax */

const httpStatus = require('http-status');
const { ObjectId } = require('mongodb');
const ApiError = require('../utils/ApiError');
const Role = require('../models/role.model');
const { User } = require('../models');
const Menu = require('../config/menu');
const Displayfields = require('../config/displayfields');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const checkFlag = 'email'; // email or phone
  const checkParam = checkFlag === 'phone' ? userBody.phone : userBody.email;
  if (await User.checkIfAvailable(checkFlag, checkParam)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `${checkFlag} already taken`);
  }
  return User.create(userBody);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email, isDeleted: false }).populate('role');
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
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  users.Displayfields = Displayfields.user;
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(ObjectId(id)).populate('role');
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const checkFlag = 'email'; // email or phone
  const checkParam = checkFlag === 'phone' ? updateBody.phone : updateBody.email;
  if (checkParam && (await User.checkIfAvailable(checkParam, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, `${checkFlag} already taken`);
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  user.isDeleted = true;
  await user.save();
  return user;
};

const removeFile = async (userId, fileIndex) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user.files.length === 1) {
    user.files = undefined;
  } else {
    user.files.splice(fileIndex, 1);
  }
  const updateUser = await updateUserById(userId, {
    files: user.files,
  });
  return updateUser;
};
const deleteMultipleUsers = async (req, res) => {
  const processedIds = req.body.ids; // Array value CS1, CS2, CS3
  // eslint-disable-next-line no-return-assign
  processedIds.forEach((value, index) => (processedIds[index] = ObjectId(value)));
  if (req.body.ids.length !== 0) {
    User.updateMany({ _id: { $in: processedIds } }, { $set: { isDeleted: true } }, function (err) {
      if (err) {
        // console.log(`ss${err}`);
      } else {
        res.send('Successful deleted selected records.');
      }
    });
  } else {
    res.send('No ids present');
  }
};

const menuManagement = async (role) => {
  const menuss = Menu.Menu;
  let userMenu = [];
  const rolename = [];
  const indes = [];
  let arrayWithValuesRemoved = [];
  // eslint-disable-next-line no-plusplus
  for (const each of role.permissions) {
    if (each.create === true || each.view === true || each.delete === true || each.edit === true) {
      rolename.push(each.section);
    }
    // eslint-disable-next-line no-use-before-define
    rolename.forEach(getIndex);

    // eslint-disable-next-line no-inner-declarations
    function getIndex(value) {
      const findIndex = menuss.findIndex((a) => a.modules === value);
      indes.push(findIndex);
    }
    const indexSet = new Set(indes);

    arrayWithValuesRemoved = menuss.filter((_value, k) => indexSet.has(k));
  }

  userMenu = arrayWithValuesRemoved;

  return userMenu;
};
const refreshMenu = async (role) => {
  let permission;
  const menuss = Menu.Menu;
  let userMenu = [];
  const rolename = [];
  const indes = [];
  let arrayWithValuesRemoved = [];
  const users = await Role.find({ name: role }).exec();
  // eslint-disable-next-line array-callback-return
  users.map((user) => {
    // console.log(user.permissions);
    permission = user.permissions;
    // eslint-disable-next-line no-plusplus
    for (const each of user.permissions) {
      if (each.create === true || each.view === true || each.delete === true || each.edit === true) {
        rolename.push(each.section);
      }
      // eslint-disable-next-line no-use-before-define
      rolename.forEach(myFunction);

      // eslint-disable-next-line no-inner-declarations
      function myFunction(value) {
        const findIndex = menuss.findIndex((a) => a.modules === value);
        indes.push(findIndex);
      }
      const indexSet = new Set(indes);

      arrayWithValuesRemoved = menuss.filter((_value, k) => indexSet.has(k));
    }
  });
  userMenu = arrayWithValuesRemoved;
  return { userMenu, permission };
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  deleteMultipleUsers,
  menuManagement,
  refreshMenu,
  removeFile,
};
