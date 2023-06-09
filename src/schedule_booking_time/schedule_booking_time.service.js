const models = require('../models');

const findAndCountAllByCondition = async (condition) => {
  return await models.schedule_booking_time.findAndCountAll(condition);
};

module.exports = {
  findAndCountAllByCondition,
};
