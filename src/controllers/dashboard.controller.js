const { dashboardService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const getDashboard = catchAsync(async (_req, res) => {
  const data = await dashboardService.getDashboard();
  res.send(data);
});

module.exports = {
  getDashboard,
};
