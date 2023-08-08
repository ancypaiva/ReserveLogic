/* eslint-disable consistent-return */
const amazonS3 = require('@armiasystems/s3-upload');
const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const { settingsService } = require('../services');
const { formatResponse } = require('../utils/commonUtils');

const storage = multer.memoryStorage({
  destination(_req, _file, callback) {
    callback(null, '');
  },
});

const uploadSettings = {
  accessKeyID: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION,
  s3bucket: process.env.S3_BUCKET,
  folderName: process.env.S3_FOLDER,
};
const getSettings = catchAsync(async (_req, res) => {
  const result = await settingsService.getSettings();
  res.send(result);
});

const getLogoDetails = catchAsync(async (_req, res) => {
  const result = await settingsService.getSettings();
  result[0].values = {};
  res.send(result[0]);
});

const updateSettings = catchAsync(async (req, res) => {
  const settings = await settingsService.updateSettingsByType(req.params.type, req.body);
  res.send(settings);
});

const updateLogo = catchAsync(async (req, res) => {
  const upload = multer({ storage }).any();
  upload(req, res, async function (err) {
    if (err) return res.json({ success: false, msg: 'Error uploading file..' });

    if (req.files) {
      await amazonS3
        .uploadFile(req.files, uploadSettings)
        .then(async (filesUploads) => {
          const uploadsFiles = filesUploads[0].Location;

          const settings = await settingsService.updateSettingsByType('general', { logo: uploadsFiles });
          res.send(formatResponse(true, 200, 'logo-upload', { settings }));
        })
        .catch(function (error) {
          return res.json({ success: false, msg: error });
        });
    }
  });
});

const removeLogo = catchAsync(async (req, res) => {
  const settings = await settingsService.updateSettingsByType('general', { logo: req.body.logo });
  res.send(formatResponse(true, 200, 'logo-updated', { settings }));
});
const updateDate = catchAsync(async (req, res) => {
  const settings = await settingsService.updateSettingsByType('general', { dateFormat: req.body.values.dateFormat });
  res.send(formatResponse(true, 200, 'date-format-updated', { settings }));
});
module.exports = {
  getSettings,
  updateSettings,
  updateLogo,
  removeLogo,
  updateDate,
  getLogoDetails,
};
