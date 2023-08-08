const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const notificationsController = require('../../controllers/notifications.controller');
const notificationValidation = require('../../validations/notifications.validation');

const router = express.Router();

router.route('/').get(auth(), validate(notificationValidation.getNotifications), notificationsController.getNotifications);
router.route('/getUnreadNotificationCount').get(auth(), notificationsController.getUnreadNotificationCount);
router.route('/getUserMenu').get(auth(), notificationsController.getUserMenu);

module.exports = router;
