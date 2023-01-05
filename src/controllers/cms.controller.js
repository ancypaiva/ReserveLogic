/* eslint-disable global-require */

const catchAsync = require('../utils/catchAsync');
const { formatResponse } = require('../utils/commonUtils');
const { cmsService } = require('../services');

const getCms = catchAsync(async (req, res) => {
  const content = await cmsService.getCmsByName(req.params.name);
  if (!content) {
    res.send(formatResponse(true, 200, 'get-cms', { name: '', description: '' }));
  }
  res.send(formatResponse(true, 200, 'get-cms', { content }));
});

const updateCms = catchAsync(async (req, res) => {
  const user = await cmsService.updateContentByName(req.params.name, req.body);
  res.send(formatResponse(true, 200, 'update-cms', { user }));
});

module.exports = {
  getCms,
  updateCms,
};
