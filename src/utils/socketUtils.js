const socket = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const logger = require('../config/logger');
const { redisClient } = require('./redisCache');

const subClient = redisClient.duplicate();

let io;

const connectSocket = (server) => {
  io = socket(server, {
    cors: {
      origin: '*',
    },
  });

  // redis adaptor
  io.adapter(createAdapter(redisClient, subClient));
  io.of('/').adapter.on('error', function (error) {
    logger.info('Error socket io redis', error);
  });

  io.on('connection', async (socketConnection) => {
    // joined a room
    socketConnection.on('room', (room) => {
      socketConnection.join(room);
    });
  });
  return true;
};

const emitSocketUpdate = (params) => {
  io.to(params.room).emit(params.socketEvent, params.message, params.unreadCount);
  return true;
};

module.exports = {
  connectSocket,
  emitSocketUpdate,
};
