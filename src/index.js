/* eslint-disable global-require */
const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
require('./utils/redisCache');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  server = app.listen(config.port, () => {
    logger.info(`Listening on port ${config.port}`);
  });
  // console.log('CNF : ', config.socketStatus)
  if (config.socketStatus === 'ON') {
    const { connectSocket } = require('./utils/socketUtils');
    connectSocket(server);
  }
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
  logger.info('Connected to database');
  logger.info(process.env.APP_URL.toString());
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  logger.error(`database connection error: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  logger.info('database disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    logger.info('database disconnected through app termination');
    process.exit(0);
  });
});

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
