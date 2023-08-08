const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const userService = require('../services/user.service');

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;
  const module = req.baseUrl.replace(/.*\/(\w+)\/?$/, '$1');
  // eslint-disable-next-line no-underscore-dangle
  const UserRole = await userService.getUserById(user._id.toString());
  const userRights = UserRole.role.permissions;
  const { method } = req;
  let permission = '';
  let anypermission = false;
  switch (method) {
    case 'GET':
      if (!Object.keys(req.params).length) {
        anypermission = true;
      } else {
        permission = 'view';
      }
      break;
    case 'POST':
      permission = 'create';

      break;
    case 'PATCH':
      permission = 'edit';

      break;
    case 'DELETE':
      permission = 'delete';

      break;
    default:
      anypermission = true;
  }
  let filteredResult = false;
  if (anypermission) {
    filteredResult = userRights.find((e) =>
      e.submenu
        ? e.submenu.find(
            (a) => a.section === module && (a.view === true || a.create === true || a.edit === true || a.delete === true)
          )
        : e.section === module && (e.view === true || e.create === true || e.edit === true || e.delete === true)
    );
  } else {
    filteredResult = userRights.find((e) =>
      e.submenu
        ? e.submenu.find((a) => a.section === module && a[permission] === true)
        : e.section === module && e[permission] === true
    );
    if (!filteredResult && permission === 'view')
      filteredResult = userRights.find((e) =>
        e.submenu ? e.submenu.find((a) => a.section === module && a.edit === true) : e.section === module && e.edit === true
      );
  }
  if (!filteredResult) {
    return reject(new ApiError(httpStatus.FORBIDDEN, 'Permission Denied'));
  }
  resolve();

  return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
};

const auth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
