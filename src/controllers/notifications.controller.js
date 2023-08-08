const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');
const { formatResponse } = require('../utils/commonUtils');
const { emitSocketUpdate } = require('../utils/socketUtils');
const logger = require('../config/logger');
const { getCacheData } = require('../utils/redisCache');

const getNotifications = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['active']);
  filter.user_id = req.user.id;
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'searchBy']);

  notificationService.markNotificationsRead(req.user.id);

  // Socket io emit event
  const sockerParams = {
    room: req.user.id,
    socketEvent: 'notificationClearUpdate',
    message: '',
    unreadCount: 0,
  };
  emitSocketUpdate(sockerParams);

  const result = await notificationService.queryNotifications(filter, options);
  res.send(formatResponse(true, 200, 'list-notifications', { result }));
});

const getUnreadNotificationCount = async (req, res) => {
  try {
    const result = await notificationService.getUnreadCount(req.user.id);
    res.send(formatResponse(true, 200, 'notifications-count', { result }));
  } catch (error) {
    logger.log('Error fetching notification count :', error);
  }
};

const getUserMenu = catchAsync(async (req, res) => {
  const userLogined = await getCacheData(`user-${req.user.id}`);
  const parsedUserData = JSON.parse(userLogined);
  const userMenus = await getCacheData(`menu-${parsedUserData.role.name}`);
  const userMenu = JSON.parse(userMenus);
  res.send(formatResponse(true, 200, 'Menu', { userMenu }));
});

module.exports = {
  getNotifications,
  getUnreadNotificationCount,
  getUserMenu,
};
