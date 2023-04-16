const models = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { BOOKING_STATUS } = require('../booking/booking.constant');
const logger = require('../config/logger');

const checkBookingPayment = async (id_booking, id_user, txn_ref) => {
  const booking = await models.booking.findOne({
    where: { id: id_booking, booking_status: BOOKING_STATUS.WAITING },
  });
  if (!booking) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid booking');
  }
  if (booking.is_payment) {
    throw new ApiError(httpStatus.OK, 'This booking has been paid');
  }
  if (booking.id_user !== id_user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user booking');
  }

  // create booking payment
  return await models.booking_payment.create({ id_booking, id_user, txn_ref });
};

const handlePaymentSuccess = async (txn_ref) => {
  const transaction = await models.sequelize.transaction();
  try {
    const booking_payment = await models.booking_payment.findOne({ where: { txn_ref } }, { transaction });
    if (booking_payment.handle) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'This booking is handle before');
    }
    booking_payment.handle = true;

    const booking = await models.booking.findOne({ where: { id: booking_payment.id_booking } }, { transaction });
    booking.is_payment = true;

    await booking_payment.save({ transaction });
    await booking.save({ transaction });

    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    logger.error('Error handle payment success' + e.message);
    throw new ApiError(httpStatus.BAD_REQUEST, e.message);
  }
};

module.exports = {
  checkBookingPayment,
  handlePaymentSuccess,
};
