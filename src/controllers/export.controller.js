const { exportService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const postDummyReportDownload = catchAsync(async (req, res) => {
  return exportService.generatePdf(req, res);
});

module.exports = {
  postDummyReportDownload,
};
