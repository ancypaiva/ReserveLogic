const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { reportService } = require('../services');

const getReport = catchAsync(async (req, res) => {
  const daterange = pick(req.query, ['daterange']);
  const result = await reportService.queryReport(daterange, req.params.section, ['name', 'email', 'phone', 'designation']);
  const results = {
    result,
    title: 'Employee Report',
    headers: ['NAME', 'EMAIL', 'PHONE', 'DESIGNATION'],
  };
  res.send(results);
});

module.exports = {
  getReport,
};
