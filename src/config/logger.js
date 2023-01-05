const winston = require('winston');

const { combine, splat, timestamp: displayTime, printf } = winston.format;
const config = require('./config');

// function to define the log display format
const displayErrorFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message} `;
  if (metadata) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

// winston logger object creation with expected parameters
const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: combine(
    config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    splat(),
    displayTime({
      format: 'MMM-DD-YYYY HH:mm:ss',
    }),
    displayErrorFormat
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

module.exports = logger;
