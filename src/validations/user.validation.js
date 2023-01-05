const Joi = require('joi');
const { password, phoneNumber } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    dateOfBirth: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.string().required().custom(phoneNumber),
    password: Joi.string().required().custom(password),
    role: Joi.string(),
    isVerified: Joi.boolean(),
    File: Joi.any(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    active: Joi.boolean(),
    sortBy: Joi.string(),
    searchBy: Joi.string(),
    autocomplete: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      phone: Joi.string().required().custom(phoneNumber),
      dateOfBirth: Joi.string(),
      isVerified: Joi.boolean(),
      File: Joi.any(),
      // password: Joi.string().required().custom(password),
      role: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
