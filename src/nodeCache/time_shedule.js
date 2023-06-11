const nodeCache = require('../config/nodeCache');
const timeScheduleService = require('../time_schedule/time_schedule.service');

const initTimeScheduleCache = async () => {
  const time_schedule = await timeScheduleService.findAllTimeSchedule();
  nodeCache.set('time_schedule', time_schedule, 0);
};

const getTimeScheduleCache = () => {
  return nodeCache.get('time_schedule');
};

module.exports = {
  initTimeScheduleCache,
  getTimeScheduleCache,
};
