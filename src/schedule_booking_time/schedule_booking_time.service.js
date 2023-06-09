const models = require('../models');

const initScheduleBookingTime = async () => {
  const listExpertise = await models.expertise.findAll();
  const listTimeSchedule = await models.time_schedule.findAll({
    order: [['time_start', 'asc']],
  });
  const listData = [];
  for (let i = 0; i < listExpertise.length; i++) {
    for (let j = 0; j < listTimeSchedule.length; j++) {
      listData.push({
        id_expertise: listExpertise[i].id,
        id_time_schedule: listTimeSchedule[j].id,
        total_online: 4,
        total_offline: 6,
        total_offline_booking_online: 3,
      });
    }
  }
  return await models.schedule_booking_time.bulkCreate(listData);
};

const findAndCountAllByCondition = async (condition) => {
  return await models.schedule_booking_time.findAndCountAll(condition);
};

module.exports = {
  findAndCountAllByCondition,
  initScheduleBookingTime,
};
