const Queue = require('bull');
const config = require('../config/config');
const { saveNotification, sendSignUpEmail, uploadImagetoS3 } = require('./redisQueueWorker');

const redisConfig = {
  redis: {
    port: config.redis.port,
    host: config.redis.host,
    password: config.redis.pass,
  },
};

const notificationCreateQueue = new Queue('notificationCreateQueue', redisConfig);
const sendSignupEmailQueue = new Queue('sendSignupEmail', redisConfig);
const uploadImageToS3Bucket = new Queue('uploadImagetoS3', redisConfig);

notificationCreateQueue.process(saveNotification);
sendSignupEmailQueue.process(sendSignUpEmail);
uploadImageToS3Bucket.process(uploadImagetoS3);

const subscribeToNotificationQueue = async (data) => {
  notificationCreateQueue.add(data);
};
const subscribeToSignupEmail = async (data) => {
  sendSignupEmailQueue.add(data);
};
const subscribeToS3ImageUpload = async (data) => {
  uploadImageToS3Bucket.add(data);
};

module.exports = {
  subscribeToNotificationQueue,
  subscribeToSignupEmail,
  subscribeToS3ImageUpload,
};
