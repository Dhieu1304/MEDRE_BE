const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { myQueue } = require('./queue/queue');

const buyAmount = async (amount) => {
  return new Promise(async (resolve, reject) => {
    const job = await myQueue.createJob({ amount }).save();
    job.on('succeeded', (result) => {
      console.log(result);
      resolve(result);
    });
    job.on('failed', (err) => {
      console.log(err.message);
      reject(err);
    });
  });
};

module.exports = {
  buyAmount,
};
