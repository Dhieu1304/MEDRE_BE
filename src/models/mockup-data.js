const logger = require('../config/logger');
const config = require('../config');
const db = require('../config/database');
const models = require('./index');
const xlsx = require('node-xlsx');
const { createMockData } = require('../utils/createMockData');

(async () => {
  try {
    if (config.postgresql.db_sync === 1) {
      logger.info('------------------------- SYNC DATABASE -------------------------');

      await db.sync({ force: true });

      logger.info('--------------------------- INIT USER ---------------------------');
      const user = xlsx.parse(__dirname + '/data/user.xlsx');
      await models.user.bulkCreate(createMockData(user[0].data));

      logger.info('----------------------- INIT TIME SCHEDULE -----------------------');
      const timeSchedule = xlsx.parse(__dirname + '/data/time_schedule.xlsx');
      await models.time_schedule.bulkCreate(createMockData(timeSchedule[0].data));

      logger.info('-------------------------- INIT STAFF ----------------------------');
      const staff = xlsx.parse(__dirname + '/data/staff.xlsx');
      await models.staff.bulkCreate(createMockData(staff[0].data));

      logger.info('------------------------- INIT EXPERTISE -------------------------');
      const expertise = xlsx.parse(__dirname + '/data/expertise.xlsx');
      await models.expertise.bulkCreate(createMockData(expertise[0].data));

      logger.info('---------------------- INIT STAFF_EXPERTISE ----------------------');
      const staff_expertise = xlsx.parse(__dirname + '/data/staff_expertise.xlsx');
      await models.staff_expertise.bulkCreate(createMockData(staff_expertise[0].data));

      logger.info('---------------------- INIT SCHEDULE ----------------------');
      const schedule = xlsx.parse(__dirname + '/data/schedule.xlsx');
      await models.schedule.bulkCreate(createMockData(schedule[0].data));

      logger.info('---------------------- INIT BOOKING ----------------------');
      const booking = xlsx.parse(__dirname + '/data/booking.xlsx');
      console.log(booking[0].data)
      await models.booking.bulkCreate(createMockData(booking[0].data));

      logger.info('----------------------- END SYNC DATABASE -----------------------');
    }
  } catch (e) {
    logger.error(e.message);
  }
})();
