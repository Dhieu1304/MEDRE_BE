const logger = require('../config/logger');
const config = require('../config');
const db = require('../config/database');
const models = require('./index');
const xlsx = require('node-xlsx');
const { createMockData } = require('../utils/createMockData');

(async () => {
  try {
    if (config.postgresql.db_sync === 1) {
      console.log('------------------------- SYNC DATABASE -------------------------');

      await db.sync({ force: true });

      console.log('--------------------------- INIT USER ---------------------------');
      const user = xlsx.parse(__dirname + '/data/user.xlsx');
      await models.user.bulkCreate(createMockData(user[0].data));

      console.log('----------------------- INIT TIME SCHEDULE -----------------------');
      const timeSchedule = xlsx.parse(__dirname + '/data/time_schedule.xlsx');
      await models.time_schedule.bulkCreate(createMockData(timeSchedule[0].data));

      console.log('--------------------------- INIT STAFF ---------------------------');
      const staff = xlsx.parse(__dirname + '/data/staff.xlsx');
      await models.staff.bulkCreate(createMockData(staff[0].data));

      console.log('----------------------- END SYNC DATABASE -----------------------');
    }
  } catch (e) {
    logger.error(e.message);
  }
})();
