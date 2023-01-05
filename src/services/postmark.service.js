const httpStatus = require('http-status');
const postmark = require('postmark');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { formatResponse } = require('../utils/commonUtils');

// send Email common function passing to ,template alias in the post mark and the data arrray paas to the template
const SendEmail = async (to, data, Templatealias) => {
  const client = new postmark.ServerClient(process.env.POST_MARK);
  client
    .sendEmailWithTemplate({
      From: process.env.FROM_EMAIL.toString(),
      To: to ?? process.env.TO_DEFAULT_EMAIL.toString(),
      TemplateAlias: Templatealias ?? process.env.POST_MARK_FORGET_PASSWORD,
      TemplateModel: data,
    })
    .then((res) => {
      return res.ErrorCode === 0;
    })
    .catch((err) => {
      return err;
    });
};
const sendVerificationEmail = async (to, token) => {
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `${process.env.VERIFICATIONEMAILURL}${token}`;
  const data = {
    verify: verificationEmailUrl,
  };
  const Templatealias = process.env.POST_MARK_EMAIL_VERIFICATION;
  await SendEmail(to, data, Templatealias);
};
// Postmark send email function template written in postmark and the alias is is used to identify template
const sendResetPasswordEmail = async (to, token) => {
  // const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${process.env.RESETPASSWORDURL}${token}`;
  const data = {
    reset: resetPasswordUrl,
  };
  const Templatealias = process.env.POST_MARK_FORGET_PASSWORD;
  await SendEmail(to, data, Templatealias);
};
const validateToken = async (resetPasswordToken) => {
  try {
    await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Token not found');
  }
};

const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};
const changePassword = async (req) => {
  try {
    const user = req.userid;
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user, {
      password: req.password,
    });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password change failed');
  }
};
const profileEdit = async (req, res) => {
  try {
    const user = req.userid;
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user, {
      name: req.name,
      email: req.email,
      phone: req.Phone,
    });
    res.status(httpStatus.CREATED).send(formatResponse(true, 200, 'Profile-Edit', 'profile edit success full'));
    res.send('succesfully updated the profile');
    await Token.deleteMany({ user, type: tokenTypes.ACCESS });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Profile change failed');
  }
};
const toggleChangeValue = async (req, res) => {
  try {
    const user = req.userid;
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user, {
      active: req.active,
    });
    res.send(`successfully changed toggle value to ${req.active}`);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Toggle change failed');
  }
};
module.exports = {
  SendEmail,
  sendVerificationEmail,
  sendResetPasswordEmail,
  resetPassword,
  changePassword,
  toggleChangeValue,
  profileEdit,
  validateToken,
};
