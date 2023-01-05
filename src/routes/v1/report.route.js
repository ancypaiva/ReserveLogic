const express = require('express');
const validate = require('../../middlewares/validate');
const reportvalidation = require('../../validations/report.validation');
const reportController = require('../../controllers/report.controller');

const router = express.Router();

router.route('/:section').get(validate(reportvalidation.getReport), reportController.getReport);

module.exports = router;
