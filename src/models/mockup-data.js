const logger = require('../config/logger');
const config = require('../config');
const db = require('../config/database');
const models = require('./index');
const xlsx = require('node-xlsx');
const { createMockData } = require('../utils/createMockData');
const { initGlobalSetting } = require('../nodeCache/globalSetting');

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

      logger.info('---------------------- INIT PATIENT ----------------------');
      const patient = xlsx.parse(__dirname + '/data/patient.xlsx');
      await models.patient.bulkCreate(createMockData(patient[0].data));

      logger.info('---------------------- INIT BOOKING ----------------------');
      const booking = xlsx.parse(__dirname + '/data/booking.xlsx');
      await models.booking.bulkCreate(createMockData(booking[0].data));

      logger.info('-------------------- DOCTOR TIME OFF ---------------------');
      const doctorTimeOff = xlsx.parse(__dirname + '/data/doctor_time_off.xlsx');
      await models.doctor_time_off.bulkCreate(createMockData(doctorTimeOff[0].data));

      logger.info('-------------------- CHECK-UP PACKAGE ---------------------');
      const checkupPackage = xlsx.parse(__dirname + '/data/checkup_package.xlsx');
      await models.checkup_package.bulkCreate(createMockData(checkupPackage[0].data));

      logger.info('-------------------- GLOBAL SETTING ---------------------');
      const globalSetting = xlsx.parse(__dirname + '/data/global_setting.xlsx');
      await models.global_setting.bulkCreate(createMockData(globalSetting[0].data));

      logger.info('-------------------- NOTIFICATION ---------------------');
      const notification = xlsx.parse(__dirname + '/data/notification.xlsx');
      await models.notification.bulkCreate(createMockData(notification[0].data));

      logger.info('-------------------- NOTIFICATION_USER ---------------------');
      const notification_user = xlsx.parse(__dirname + '/data/notification_user.xlsx');
      await models.notification_user.bulkCreate(createMockData(notification_user[0].data));

      logger.info('----------------------- END SYNC DATABASE -----------------------');
    }

    // init cache default from db
    await initGlobalSetting();
  } catch (e) {
    logger.error(e.message);
  }
})();
