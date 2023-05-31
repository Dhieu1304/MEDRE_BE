const models = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { BOOKING_STATUS } = require('../booking/booking.constant');
const logger = require('../config/logger');
const { PAYMENT_STATUS } = require('../booking_payment/booking_payment.constant');
const i18next = require('i18next');
const { v4: uuidv4 } = require('uuid');
const { SCHEDULE_TYPE } = require('../schedule/schedule.constant');
const randomString = require('../utils/randomString');
const {rmWaitingBooking} = require("../nodeCache/booking");

const checkBookingPayment = async (id_booking, id_user, txn_ref) => {
  const booking = await models.booking.findOne({
    where: { id: id_booking, booking_status: BOOKING_STATUS.WAITING },
  });
  if (!booking) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('payment.invalidBooking'));
  }
  if (booking.is_payment) {
    throw new ApiError(httpStatus.OK, i18next.t('payment.paymentBefore'));
  }
  if (booking.id_user !== id_user) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('payment.invalidUserBooking'));
  }

  // create booking payment
  return await models.booking_payment.create({ id: uuidv4(), id_booking, id_user, txn_ref });
};

const handlePaymentSuccess = async (txn_ref) => {
  const transaction = await models.sequelize.transaction();
  try {
    const booking_payment = await models.booking_payment.findOne({ where: { txn_ref } }, { transaction });
    if (booking_payment.handle) {
      throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('payment.handleBefore'));
    }
    booking_payment.handle = true;
    booking_payment.rsp_code = '00';

    const booking = await models.booking.findOne(
      {
        where: { id: booking_payment.id_booking },
        include: [{ model: models.schedule, as: 'booking_schedule' }],
      },
      { transaction }
    );
    booking.is_payment = true;
    booking.booking_status = BOOKING_STATUS.BOOKED;
    if (booking.booking_schedule.type === SCHEDULE_TYPE.ONLINE) {
      booking.code = `${booking.id}-${randomString(5)}`;
    }

    await booking_payment.save({ transaction });
    await booking.save({ transaction });

    // delete cache
    await rmWaitingBooking(booking_payment.id_booking);

    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    logger.error('Error handle payment success' + e.message);
    throw new ApiError(httpStatus.BAD_REQUEST, e.message);
  }
};

const handlePaymentFail = async (txn_ref, rsp_code) => {
  const booking_payment = await models.booking_payment.findOne({ where: { txn_ref } });
  if (booking_payment.handle) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('payment.handleBefore'));
  }
  booking_payment.handle = true;
  booking_payment.rsp_code = rsp_code;
  booking_payment.status = PAYMENT_STATUS.FAIL;

  await booking_payment.save();
};

const cashPayment = async (id_booking, user) => {
  // check booking is exist
  const booking = await models.booking.findOne({
    where: { id: id_booking },
    include: [{ model: models.schedule, as: 'booking_schedule' }],
  });
  if (!booking || booking.booking_status !== BOOKING_STATUS.WAITING || booking.is_payment) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('booking.invalidID'));
  }

  // check user booking
  if (booking.id_user !== user.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('payment.invalidUserBooking'));
  }

  // check offline
  if (booking.booking_schedule.type !== SCHEDULE_TYPE.OFFLINE) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('payment.invalidBookingType'));
  }

  // delete cache
  await rmWaitingBooking(id_booking);

  booking.booking_status = BOOKING_STATUS.BOOKED;
  return await booking.save();
};

module.exports = {
  checkBookingPayment,
  handlePaymentSuccess,
  handlePaymentFail,
  cashPayment,
};
