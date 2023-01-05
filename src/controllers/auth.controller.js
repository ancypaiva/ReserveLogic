const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { formatResponse } = require('../utils/commonUtils');
const { authService, userService, tokenService, postmarkService, roleService } = require('../services');
const { getCacheData, setCacheDataWithExpiry } = require('../utils/redisCache');

const sendVerificationEmail = async (user) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await postmarkService.sendVerificationEmail(user.email, verifyEmailToken);
};
/**
 * Signup a user
 * @param {Object} req, res
 * @returns {JSON<User>}
 */
const signup = catchAsync(async (req, res) => {
  const insertUserData = req.body;
  let defaultRole = null;
  await getCacheData('defaultRole').then((result) => {
    defaultRole = result;
  });
  if (!defaultRole) {
    defaultRole = await roleService.getDefaultRole();
  }
  insertUserData.role = defaultRole;
  const user = await userService.createUser(insertUserData);
  const tokens = await tokenService.generateAuthTokens(user);
  sendVerificationEmail(user);
  res.status(httpStatus.CREATED).send(formatResponse(true, 200, 'user-signup', { user, tokens }));
});

/**
 * Login
 * @param {Object} req, res
 * @returns {JSON<User><tokens>}
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  const { role } = user;
  const userMenu = await userService.menuManagement(role);
  // store data in redis cache
  setCacheDataWithExpiry(`user-${user.id}`, JSON.stringify(user));
  res.send(formatResponse(true, 200, 'user-login', { user, tokens, userMenu }));
});

/**
 * Logout
 * @param {Object} req, res
 * @returns {httpstatus}
 */
const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * refresh tokens
 * @param {Object} req, res
 * @returns {tokens}
 */
const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send(formatResponse(true, 200, 'token', { ...tokens }));
});
const refreshMenu = catchAsync(async (req, res) => {
  const userMenu = await userService.refreshMenu(req.body.role);
  res.send(formatResponse(true, 200, 'Menu', { userMenu }));
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await postmarkService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.send(formatResponse(true, 200, 'forget-password', 'reset password link sent to your email'));
});

const resetPassword = catchAsync(async (req, res) => {
  await postmarkService.resetPassword(req.body.token, req.body.password);
  res.send(formatResponse(true, 200, 'reset-password', 'reset-password successfully completed'));
});

const validateToken = catchAsync(async (req, res) => {
  await postmarkService.validateToken(req.body.token);
  res.send(formatResponse(true, 200, 'reset-password', 'token verification success'));
});
const changePassword = catchAsync(async (req, res) => {
  await postmarkService.changePassword(req.body);
  res.send(formatResponse(true, 200, 'change-password', 'change-password successfully completed'));
});
const profileEdit = catchAsync(async (req, res) => {
  await postmarkService.profileEdit(req.body, res);
  res.status(httpStatus.NO_CONTENT).send();
});
const toggleChange = catchAsync(async (req, res) => {
  await postmarkService.toggleChangeValue(req.body, res);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.send(formatResponse(true, 200, 'verify-email', 'email-verification successfully completed'));
});

module.exports = {
  signup,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  changePassword,
  toggleChange,
  profileEdit,
  refreshMenu,
  validateToken,
};
