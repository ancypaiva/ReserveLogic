const express = require('express');
const cmsController = require('../../controllers/cms.controller');

const router = express.Router();

router.route('/:name').get(cmsController.getCms).patch(cmsController.updateCms);

module.exports = router;
