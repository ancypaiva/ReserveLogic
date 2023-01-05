const redis = require('redis');
const config = require('../config/config');
const logger = require('../config/logger');
const catchAsync = require('./catchAsync');

const redisClient = redis.createClient({ url: config.redis.url });
const connectRedis = async () => {
  await redisClient.connect();
};

connectRedis();

redisClient.on('connect', () => {
  logger.info('Redis connected successfully');
});

redisClient.on('ready', () => {
  logger.info('Redis client is ready to use');
});

redisClient.on('error', (err) => {
  logger.error(`Redis connection error : ${err.message}`);
});

redisClient.on('end', () => {
  logger.info('Redis connection ended');
});

process.on('SIGNINT', () => {
  redisClient.quit();
});

const setCacheDataWithExpiry = (key, value, expiry = config.redis.expiry) => {
  return redisClient.SETEX(key, expiry, value);
};

const getCacheData = (key) => {
  return redisClient.GET(key);
};

const deleteCacheData = (key) => {
  return redisClient.DEL(key);
};

const setCacheDataWithExpiryAsync = catchAsync(async (key, value, expiry = config.redis.expiry) => {
  const ret = await redisClient.SETEX(key, expiry, value);
  return ret;
});

const getCacheDataAsync = catchAsync(async (key) => {
  const ret = await redisClient.GET(key);
  return ret;
});

const deleteCacheDataAsync = catchAsync(async (key) => {
  const ret = await redisClient.DEL(key);
  return ret;
});

module.exports = {
  redisClient,
  setCacheDataWithExpiry,
  getCacheData,
  setCacheDataWithExpiryAsync,
  getCacheDataAsync,
  deleteCacheData,
  deleteCacheDataAsync,
};
