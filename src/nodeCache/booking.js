const nodeCache = require('../config/nodeCache');
const logger = require('../config/logger');
const models = require('../models');
const { BOOKING_STATUS } = require('../booking/booking.constant');
const { getGlobalSettingByName } = require('./global_setting');
const { GLOBAL_SETTING } = require('../global_setting/global_setting.constant');

const waitingBooking = (id) => {
  nodeCache.set(`wait_book_${id}`, 1, getGlobalSettingByName(GLOBAL_SETTING.CANCEL_ONLINE_BOOKING_AFTER_MINUTE) * 60);
};

nodeCache.on('expired', async function (key) {
  if (key.startsWith('wait_book_')) {
    logger.info('Expire booking waiting: ', key);
    try {
      const id_booking = key.split('wait_book_')[1];
      const booking = await models.booking.findOne({ where: { id: id_booking } });
      if (booking.booking_status !== BOOKING_STATUS.WAITING) {
        return logger.info(`Booking id: ${id_booking} status: ${booking.booking_status}`);
      }
      if (booking.is_payment) {
        return logger.info(`Booking id: ${id_booking} is payment`);
      }
      // cancel this booking
      booking.booking_status = BOOKING_STATUS.CANCELED;
      booking.canceledAt = new Date();
      await booking.save();
    } catch (e) {
      logger.error('Err cancel online booking without payment: ', e.message);
    }
  }
});

const rmWaitingBooking = (id) => {
  nodeCache.del(`wait_book_${id}`);
};

module.exports = {
  waitingBooking,
  rmWaitingBooking,
};
