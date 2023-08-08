const firebaseObject = require('flamingo-firebase-api');
const { Notifications } = require('../models');
const Displayfields = require('../config/displayfields');
const { emitSocketUpdate } = require('../utils/socketUtils');

const queryNotifications = async (filter, options) => {
  const notifications = await Notifications.paginate(filter, options);
  notifications.Displayfields = Displayfields.notifications;
  return notifications;
};

const getUnreadCount = async (userId) => {
  return Notifications.count({ user_id: userId, read_status: false });
};

const createNotification = async (notificationBody) => {
  const result = await Notifications.create(notificationBody);

  const notificationCount = await getUnreadCount(result.user_id);

  // Socket io emit event
  const sockerParams = {
    room: result.user_id,
    socketEvent: 'newNotificationUpdate',
    message: 'You have a new notification.',
    unreadCount: notificationCount,
  };
  emitSocketUpdate(sockerParams);

  // firebase
  const privateKey = JSON.parse(process.env.CONFIG_PRIVATE_KEY);
  const firebaseData = {
    config: {
      type: process.env.CONFIG_TYPE,
      project_id: process.env.CONFIG_PROJECT_ID,
      private_key_id: process.env.CONFIG_PRIVATE_KEY_ID,
      private_key: privateKey.private_key,
      client_email: process.env.CONFIG_CLIENT_EMAIL,
      client_id: process.env.CONFIG_CLIENT_ID,
      auth_uri: process.env.CONFIG_AUTH_URI,
      token_uri: process.env.CONFIG_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.CONFIG_AUTH_PROVIDER,
      client_x509_cert_url: process.env.CONFIG_CLIENT_CERT_URL,
    },
    inputData: {
      count: notificationCount,
    },
    userId: result.user_id,
    databaseURL: process.env.DATABASEURL,
    collectionURL: process.env.COLLECTIONURL,
  };
  await firebaseObject.firebaseDataUpdate(firebaseData);
  // firebase ends
  return result;
};

const markNotificationsRead = async (userId) => {
  const where = { user_id: userId };
  const updateData = { $set: { read_status: true } };
  const result = await Notifications.updateMany(where, updateData, { upsert: true });

  // firebase
  const privateKey = JSON.parse(process.env.CONFIG_PRIVATE_KEY);
  const firebaseData = {
    config: {
      type: process.env.CONFIG_TYPE,
      project_id: process.env.CONFIG_PROJECT_ID,
      private_key_id: process.env.CONFIG_PRIVATE_KEY_ID,
      private_key: privateKey.private_key,
      client_email: process.env.CONFIG_CLIENT_EMAIL,
      client_id: process.env.CONFIG_CLIENT_ID,
      auth_uri: process.env.CONFIG_AUTH_URI,
      token_uri: process.env.CONFIG_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.CONFIG_AUTH_PROVIDER,
      client_x509_cert_url: process.env.CONFIG_CLIENT_CERT_URL,
    },
    inputData: {
      count: 0,
    },
    userId,
    databaseURL: process.env.DATABASEURL,
    collectionURL: process.env.COLLECTIONURL,
  };
  await firebaseObject.firebaseDataUpdate(firebaseData);
  // firebase ends

  return result;
};

module.exports = {
  queryNotifications,
  createNotification,
  getUnreadCount,
  markNotificationsRead,
};
