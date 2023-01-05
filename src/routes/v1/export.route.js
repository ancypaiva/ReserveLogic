const express = require('express');

const exportController = require('../../controllers/export.controller');

const router = express.Router();

router.route('/export').post(exportController.postDummyReportDownload);

module.exports = router;
