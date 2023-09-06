const Queue = require('bee-queue');
const { redisClient } = require('../../config/redis');
const delay = require('../../utils/delay');
const config = require('../../config');

const myQueue = new Queue('MY_QUEUE', {
  removeOnSuccess: true,
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
  },
});

myQueue.process(async (job, done) => {
  const totalAmount = await redisClient.get('totalAmount');
  if (!totalAmount) {
    await redisClient.setNX('totalAmount', '50');
  }
  const { amount } = job.data;
  await redisClient.decrBy('totalAmount', amount);
  await delay(3000);
  done(amount);
  return amount;
});

module.exports = {
  myQueue,
};
