const Joi = require('joi');
const { password, phoneNumber } = require('./custom.validation');

const signup = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.any().custom(phoneNumber),
    password: Joi.string().required().custom(password),
    active: Joi.string(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};
const refreshMenu = {
  body: Joi.object().keys({
    role: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  // query: Joi.object().keys({
  // }),
  body: Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().required().custom(password),
  }),
};
const changePassword = {
  // query: Joi.object().keys({
  // }),
  body: Joi.object().keys({
    // email: Joi.string().required(),
    // Phone: Joi.string().required(),
    // name: Joi.string().required(),
    token: Joi.string().required(),
    password: Joi.string().required().custom(password),
    userid: Joi.string().required(),
  }),
};
const profileEdit = {
  // query: Joi.object().keys({
  // }),
  body: Joi.object().keys({
    email: Joi.string().required(),
    Phone: Joi.string().required(),
    name: Joi.string().required(),
    token: Joi.string().required(),
    userid: Joi.string().required(),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  signup,
  login,
  logout,
  refreshTokens,
  refreshMenu,
  forgotPassword,
  resetPassword,
  verifyEmail,
  changePassword,
  profileEdit,
};
