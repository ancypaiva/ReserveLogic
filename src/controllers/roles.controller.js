const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { roleService } = require('../services');
const { crud } = require('../services');
const { allModules } = require('../config/modules');
const defaultroles = require('../config/defaultroles');
const { userService } = require('../services');
const { formatResponse } = require('../utils/commonUtils');

const createRole = catchAsync(async (req, res) => {
  const roles = req.body;
  Array.prototype.push.apply(roles.permissions, defaultroles);
  const role = await crud.createEntry(roles, 'role');
  res.send(formatResponse(true, httpStatus.CREATED, 'create-role', { role }));
});

const getRoles = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['active']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'searchBy']);
  const result = await roleService.queryRoles(filter, options);
  res.send(formatResponse(true, 200, 'list-roles', { result }));
});

const getModules = catchAsync(async (_req, res) => {
  res.send(formatResponse(true, 200, 'all-modules', { allModules }));
});

const getRole = catchAsync(async (req, res) => {
  const role = await roleService.getRoleById(req.params.RoleId);
  if (!role || role.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  const response = { result: role, modules: allModules };
  res.send(formatResponse(true, 200, 'get-role', { response }));
});

const getRoleSelect = catchAsync(async (req, res) => {
  const role = await roleService.getDataSselect(req.params.RoleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  res.send(formatResponse(true, 200, 'list-roles-select', { role }));
});

const updateRole = catchAsync(async (req, res) => {
  const role = await roleService.updateRoleById(req.params.RoleId, req.body);
  const userMenu = await userService.refreshMenu(role.name);
  res.send({ success: true, code: 200, role, userMenu });
});

const deleteRole = catchAsync(async (req, res) => {
  const role = await roleService.deleteRoleById(req.params.RoleId);
  res.send(formatResponse(true, 200, 'delete-role', { role }));
});

module.exports = {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
  getRoleSelect,
  getModules,
};
