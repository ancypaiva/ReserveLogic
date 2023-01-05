/* eslint-disable global-require */
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { crud } = require('../services');

const model = 'user';

const createEntries = catchAsync(async (req, res) => {
  const user = await crud.createEntry(req.body, model);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['active']);
  const options = pick(req.query, ['searchBy', 'sortBy', 'limit', 'page']);
  const result = await crud.queryEntries(filter, options, model);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await crud.getEntryById(req.params.userId, model);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await crud.updateEntryById(req.params.userId, req.body, model);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await crud.deleteEntryById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createEntries,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
