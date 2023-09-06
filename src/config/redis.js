const redis = require('redis');
const bluebird = require('bluebird');
const config = require('../config');
const logger = require('../config/logger');

const redisClient = redis.createClient({
  url: `redis://${config.redis.host}:${config.redis.port}`,
  password: config.redis.password,
});
bluebird.promisifyAll(redis);

redisClient.on('connect', function () {
  logger.info('Redis client connected');
});

redisClient.on('error', function (err) {
  logger.error('Redis error', err);
});

module.exports = {
  redisClient,
};
