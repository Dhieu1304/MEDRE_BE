const models = require('../models');

const initScheduleBookingTime = async () => {
  const listExpertise = await models.expertise.findAll();
  const listTimeSchedule = await models.time_schedule.findAll({
    order: [['time_start', 'asc']],
  });
  const listData = [];
  for (let i = 0; i < listExpertise.length; i++) {
    let current_ordinal_number_online = 1;
    let current_ordinal_number_offline = 1;
    for (let j = 0; j < listTimeSchedule.length; j++) {
      const total_online = 4; // total booking online - online
      const total_offline = 6; // total booking offline - offline
      const total_offline_booking_online = 3; // total booking online - offline
      listData.push({
        id_expertise: listExpertise[i].id,
        id_time_schedule: listTimeSchedule[j].id,
        total_online,
        total_offline,
        total_offline_booking_online,
        current_ordinal_number_online,
        current_ordinal_number_offline,
      });
      current_ordinal_number_online += total_online;
      current_ordinal_number_offline += total_offline;
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
