const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Employee } = require('../models');
const Displayfields = require('../config/displayfields');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createEmployee = async (userBody) => {
  const checkFlag = 'email'; // email or phone
  const checkParam = checkFlag === 'phone' ? userBody.phone : userBody.email;
  if (await Employee.checkIfAvailable(checkFlag, checkParam)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `${checkFlag} already taken`);
  }
  return Employee.create(userBody);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return Employee.findOne({ email });
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
const queryEmployees = async (filter, options) => {
  const users = await Employee.paginate(filter, options);
  users.Displayfields = Displayfields.employee;
  return users;
};

const searchEmployees = async (filter, options) => {
  const query = [
    {
      $search: {
        compound: {
          should: [
            {
              text: {
                query: options.searchBy,
                path: 'name',
                score: {
                  boost: {
                    value: 6,
                  },
                },
                fuzzy: {},
              },
            },
            {
              text: {
                query: options.searchBy,
                path: ['email', 'phone', 'designation'],
                fuzzy: {},
              },
            },
          ],
        },
      },
    },
  ];
  const employees = await Employee.aggregate(query)
    .collation({ locale: 'en', strength: 2 })
    .skip(options.limit * options.page - options.limit)
    .limit(options.limit)
    .exec();
  const fullEmployees = await Employee.aggregate(query).exec();
  const results = {
    Displayfields: Displayfields.employee,
    limit: options.limit,
    page: options.page,
    results: employees,
    totalPages: Math.ceil(fullEmployees.length / options.limit),
    totalResults: fullEmployees.length,
  };
  return results;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getEmployeeById = async (id) => {
  return Employee.findById(id);
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateEmployeeById = async (userId, updateBody) => {
  const user = await getEmployeeById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const checkFlag = 'email'; // email or phone
  const checkParam = checkFlag === 'phone' ? updateBody.phone : updateBody.email;
  if (checkParam && (await Employee.checkIfAvailable(checkParam, userId))) {
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
const deleteEmployeeById = async (userId) => {
  const user = await getEmployeeById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  user.isDeleted = true;
  user.save();
  return user;
};

module.exports = {
  createEmployee,
  queryEmployees,
  getEmployeeById,
  getUserByEmail,
  updateEmployeeById,
  deleteEmployeeById,
  searchEmployees,
};
