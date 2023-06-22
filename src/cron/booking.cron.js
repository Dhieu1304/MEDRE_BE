const schedule = require('node-schedule');
const logger = require('../config/logger');
const { redisClient } = require('../config/redis');
const models = require('../models');
const { BOOKING_STATUS } = require('../booking/booking.constant');
const { getGlobalSettingByName } = require('../nodeCache/global_setting');
const { GLOBAL_SETTING } = require('../global_setting/global_setting.constant');

const cronBookingWaiting = async () => {
  const timeCancel = getGlobalSettingByName(GLOBAL_SETTING.CANCEL_ONLINE_BOOKING_AFTER_MINUTE) * 60 * 1000;
  try {
    const waitingKeys = await redisClient.keys('*wait_book_*');
    for (let i = 0; i < waitingKeys.length; i++) {
      const timeBooking = await redisClient.get(waitingKeys[i]);
      if (new Date().getTime() - timeBooking > timeCancel) {
        const id_booking = waitingKeys[i].split('wait_book_')[1];
        const booking = await models.booking.findOne({ where: { id: id_booking } });
        await redisClient.del(waitingKeys[i]);
        if (booking.booking_status !== BOOKING_STATUS.WAITING) {
          logger.info(`Booking id: ${id_booking} status: ${booking.booking_status}`);
          continue;
        }
        if (booking.is_payment) {
          logger.info(`Booking id: ${id_booking} is payment`);
          continue;
        }
        // cancel this booking
        booking.booking_status = BOOKING_STATUS.CANCELED;
        booking.canceledAt = new Date();
        await booking.save();
      }
    }
  } catch (e) {
    logger.error('Error cron booking waiting: ', e);
  }
};

// run cron every 5 minute
schedule.scheduleJob(`*/5 * * * *`, async () => {
  logger.info('Run cron check booking waiting');
  await cronBookingWaiting();
});
