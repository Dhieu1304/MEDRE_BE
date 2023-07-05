/*global _io*/
/*eslint no-undef: "error"*/
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage, paginationFormat } = require('../utils/responseFormat');
const pick = require('../utils/pick');
const bookingService = require('./booking.service');
const { Op } = require('sequelize');
const pageLimit2Offset = require('../utils/pageLimit2Offset');
const models = require('../models');
const i18next = require('i18next');
const patientService = require('../patient/patient.service');
const moment = require('moment');
const scheduleService = require('../schedule/schedule.service');
const { SCHEDULE_TYPE } = require('../schedule/schedule.constant');
const { BOOKING_STATUS } = require('./booking.constant');
const { getGlobalSettingByName } = require('../nodeCache/global_setting');
const { GLOBAL_SETTING } = require('../global_setting/global_setting.constant');
const { waitingBooking } = require('../nodeCache/booking');
const notificationUserService = require('../notification_user/notification_user.service');
const { NOTIFICATION_TYPE, NOTIFICATION_FOR } = require('../notification/notification.constant');
const { NOTIFICATION_EVENT } = require('../socket/socket.constant');
const logger = require('../config/logger');

const listBookings = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  let filter = pick(req.query, ['type', 'booking_status', 'from', 'to', 'is_payment', 'order']);
  // add user id
  filter.id_user = req.user.id;

  // convert filter from to
  if (filter.from && filter.to) {
    filter = Object.assign(filter, { date: { [Op.between]: [filter.from, filter.to] } });
    delete filter.from;
    delete filter.to;
  } else {
    if (filter.from) {
      filter.date = { [Op.gte]: filter.from };
      delete filter.from;
    }
    if (filter.to) {
      filter.date = { [Op.lte]: filter.to };
      delete filter.to;
    }
  }

  const include = [
    {
      model: models.time_schedule,
      as: 'booking_time_schedule',
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
  ];
  include.push({
    model: models.schedule,
    as: 'booking_schedule',
    where: {}, // to add type of booking
    include: [
      {
        model: models.expertise,
        as: 'schedule_expertise',
      },
      {
        model: models.staff,
        as: 'schedule_of_staff',
        attributes: { exclude: ['password'] },
      },
    ],
  });

  // convert filter type
  if (filter.type) {
    include[include.length - 1].where.type = filter.type;
    include[include.length - 1].required = true;
    delete filter.type;
  }

  include.push({ model: models.patient, as: 'booking_of_patient' });

  const order = [];

  if (filter.order) {
    const parts = filter.order.split(':');
    order.push(parts);
    if (parts[0] === 'date') {
      order.push([{ model: models.time_schedule, as: 'booking_time_schedule' }, 'time_start', parts[1]]);
    }
    delete filter.order;
  }

  const condition = {
    where: filter,
    include,
    ...pageLimit2Offset(page, limit),
    order,
  };
  const listBooking = await bookingService.findAndCountAllByCondition(condition);
  return res.status(httpStatus.OK).json(responseData(paginationFormat(listBooking, page, limit)));
});

const listBookingsForStaff = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  let filter = pick(req.query, [
    'type',
    'booking_status',
    'from',
    'to',
    'is_payment',
    'id_user',
    'id_patient',
    'id_doctor',
    'id_staff_booking',
    'id_staff_update',
    'order',
    'patient_phone_number',
  ]);

  // convert filter from to
  if (filter.from && filter.to) {
    filter = Object.assign(filter, { date: { [Op.between]: [filter.from, filter.to] } });
    delete filter.from;
    delete filter.to;
  } else {
    if (filter.from) {
      filter.date = { [Op.gte]: filter.from };
      delete filter.from;
    }
    if (filter.to) {
      filter.date = { [Op.lte]: filter.to };
      delete filter.to;
    }
  }

  const include = [
    {
      model: models.time_schedule,
      as: 'booking_time_schedule',
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
  ];
  include.push({
    model: models.schedule,
    as: 'booking_schedule',
    where: {}, // to add type of booking
    include: [
      {
        model: models.expertise,
        as: 'schedule_expertise',
      },
      {
        model: models.staff,
        as: 'schedule_of_staff',
        attributes: { exclude: ['password'] },
        where: filter.id_doctor ? { id: filter.id_doctor } : {},
      },
    ],
  });
  delete filter.id_doctor;

  // convert filter type
  if (filter.type) {
    include[include.length - 1].where.type = filter.type;
    include[include.length - 1].required = true;
    delete filter.type;
  }
  include.push({ model: models.user, as: 'booking_of_user', attributes: { exclude: ['password'] } });
  include.push({ model: models.patient, as: 'booking_of_patient', where: {} });
  if (filter.patient_phone_number) {
    include[include.length - 1].where.phone_number = filter.patient_phone_number;
    delete filter.patient_phone_number;
  }

  const order = [];

  if (filter.order) {
    order.push(filter.order.split(':'));
    delete filter.order;
  }

  const condition = {
    where: filter,
    include,
    ...pageLimit2Offset(page, limit),
    order,
  };
  const listBooking = await bookingService.findAndCountAllByCondition(condition);
  return res.status(httpStatus.OK).json(responseData(paginationFormat(listBooking, page, limit)));
});

const getDetailBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.findOneByOption({
    where: { id: req.params.id, id_user: req.user.id },
    include: [
      {
        model: models.time_schedule,
        as: 'booking_time_schedule',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: models.schedule,
        as: 'booking_schedule',
        include: [
          {
            model: models.expertise,
            as: 'schedule_expertise',
          },
          {
            model: models.staff,
            as: 'schedule_of_staff',
            attributes: { exclude: ['password'] },
            include: [
              {
                model: models.expertise,
                as: 'expertises',
                attributes: ['id', 'name'],
              },
            ],
          },
        ],
      },
      { model: models.patient, as: 'booking_of_patient' },
      { model: models.re_examination, as: 'booking_re_exam' },
    ],
  });
  return res.status(httpStatus.OK).json(responseData(booking));
});

const getDetailBookingForStaff = catchAsync(async (req, res) => {
  const booking = await bookingService.findOneByOption({
    where: { id: req.params.id },
    include: [
      {
        model: models.time_schedule,
        as: 'booking_time_schedule',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: models.schedule,
        as: 'booking_schedule',
        required: false,
        where: {},
        include: [
          {
            model: models.expertise,
            as: 'schedule_expertise',
          },
          {
            model: models.staff,
            as: 'schedule_of_staff',
            attributes: { exclude: ['password'] },
          },
        ],
      },
      { model: models.user, as: 'booking_of_user', attributes: { exclude: ['password'] } },
      { model: models.patient, as: 'booking_of_patient' },
      { model: models.re_examination, as: 'booking_re_exam' },
    ],
  });
  return res.status(httpStatus.OK).json(responseData(booking));
});

const booking = catchAsync(async (req, res) => {
  const data = pick(req.body, ['id_schedule', 'id_time', 'date', 'reason', 'id_patient']);

  // check booking date ( > 1 day)
  if (
    data.date < moment().add(getGlobalSettingByName(GLOBAL_SETTING.BOOK_ADVANCE_DAY), 'd').startOf('day') ||
    data.date > moment().add(getGlobalSettingByName(GLOBAL_SETTING.BOOK_AFTER_DAY), 'd').startOf('day')
  ) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('booking.invalidDate'), false));
  }
  data.id_user = req.user.id;

  // check book for other people
  if (!data.id_patient) {
    const patient = await patientService.findOrCreatePatientFromUser(req.user.id);
    data.id_patient = patient.id;
  }

  const newBooking = await bookingService.createNewBooking(data);
  res.status(httpStatus.OK).json(responseData(newBooking, i18next.t('booking.booking')));

  // catch error -> not throw error to user
  try {
    // add to cache -> cancel automatic
    await waitingBooking(newBooking.id);

    // create notification
    const content =
      `Bạn vừa đặt lịch thành công, vui lòng chọn hình thức thanh toán trong vòng ` +
      `${getGlobalSettingByName(GLOBAL_SETTING.CANCEL_ONLINE_BOOKING_AFTER_MINUTE)} phút. ` +
      `Nếu không sẽ bị hủy tự động.`;
    const notificationForUser = { id_user: req.user.id };
    const notificationData = {
      type: NOTIFICATION_TYPE.BOOKING,
      notification_for: NOTIFICATION_FOR.PERSONAL,
      title: 'Đặt lịch',
      content,
      id_redirect: newBooking.id,
    };
    await notificationUserService.createNotification(notificationData, notificationForUser);

    // send notification to user
    const payload = {
      notification: {
        title: 'Đặt lịch',
        body: content,
        type: NOTIFICATION_TYPE.BOOKING,
        id_redirect: newBooking.id,
      },
    };
    _io.in(req.user.id).emit(NOTIFICATION_EVENT.NOTIFICATION, payload);
    await notificationUserService.sendNotificationTopicFCM(req.user.id, payload);

    // create notification for CS
    const contentForCS = `Vừa có người dùng đặt lịch mới`;
    const notificationDataForCS = {
      type: NOTIFICATION_TYPE.BOOKING,
      notification_for: NOTIFICATION_FOR.CUSTOMER_SERVICE,
      title: 'Đặt lịch',
      content: contentForCS,
      id_redirect: newBooking.id,
    };
    await notificationUserService.createNotification(notificationDataForCS, null);

    const payloadForCS = {
      notification: {
        title: 'Đặt lịch',
        body: contentForCS,
        type: NOTIFICATION_TYPE.BOOKING,
        id_redirect: newBooking.id,
      },
    };
    // send notification to user customer service
    _io.in(NOTIFICATION_FOR.CUSTOMER_SERVICE).emit(NOTIFICATION_EVENT.NOTIFICATION, payloadForCS);
    await notificationUserService.sendNotificationTopicFCM(NOTIFICATION_FOR.CUSTOMER_SERVICE, payloadForCS);
  } catch (e) {
    logger.error('Error create notification of new booking: ', e.message);
  }
});

const updateBooking = catchAsync(async (req, res) => {
  const data = pick(req.body, [
    'id',
    'booking_status',
    'is_payment',
    'code',
    'reason',
    'id_patient',
    'id_schedule',
    'date',
    'id_time',
  ]);

  data.id_staff_update = req.user.id;
  if (data.booking_status === BOOKING_STATUS.BOOKED) {
    data.bookedAt = new Date();
  } else if (data.booking_status === BOOKING_STATUS.CANCELED) {
    data.canceledAt = new Date();
  }

  const updateBooking = await bookingService.updateBooking(data);
  return res.status(httpStatus.OK).json(responseData(updateBooking, i18next.t('booking.update')));
});

const updateBookingDoctor = catchAsync(async (req, res) => {
  const data = pick(req.body, ['id', 'note', 'conclusion', 'prescription']);
  const updateBooking = await bookingService.updateBookingDoctor(data);
  return res.status(httpStatus.OK).json(responseData(updateBooking, i18next.t('booking.update')));
});

const cancelBooking = catchAsync(async (req, res) => {
  await bookingService.cancelBooking(req.user.id, req.body.id);
  return res.status(httpStatus.OK).json(responseMessage(i18next.t('booking.cancel'), true));
});

// only create booking offline (for user not have account)
const staffCreateBooking = catchAsync(async (req, res) => {
  const data = req.body;

  // check booking date ( > 1 day)
  /*
  if (
    data.date < moment().add(getGlobalSettingByName(GLOBAL_SETTING.BOOK_ADVANCE_DAY), 'd') ||
    data.date > moment().add(getGlobalSettingByName(GLOBAL_SETTING.BOOK_AFTER_DAY), 'd')
  ) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('booking.invalidDate'), false));
  }
  */

  // check schedule is offline
  const schedule = await scheduleService.findOneByFilter({ id: data.id_schedule });
  if (!schedule || schedule.type !== SCHEDULE_TYPE.OFFLINE) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('booking.invalidScheduleId'), false));
  }

  data.id_staff_booking = req.user.id;
  data.booking_status = BOOKING_STATUS.BOOKED;
  data.bookedAt = new Date();

  if (!data.id_user && !data.id_patient) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('booking.idRequired'), false));
  }

  // check book for other people
  if (!data.id_patient) {
    const patient = await patientService.findOrCreatePatientFromUser(data.id_user);
    data.id_patient = patient.id;
  }

  const newBooking = await bookingService.createNewBookingForStaff(data);

  return res.status(httpStatus.OK).json(responseData(newBooking, i18next.t('booking.booking')));
});

const scheduleBookingTimeCount = catchAsync(async (req, res) => {
  const { id_expertise, id_doctor, from, to, bookingMethod } = pick(req.query, [
    'id_expertise',
    'id_doctor',
    'from',
    'to',
    'bookingMethod',
  ]);
  if (from > to) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('booking.dateInvalid')));
  }
  const filter = {
    date: { [Op.between]: [from, to] },
    booking_status: [BOOKING_STATUS.BOOKED, BOOKING_STATUS.WAITING],
  };
  switch (bookingMethod) {
    case 'remote': {
      filter.id_staff_booking = null;
      break;
    }
    case 'redirect': {
      filter.id_staff_booking = { [Op.ne]: null };
      break;
    }
    default:
      break;
  }

  const data = await bookingService.countScheduleBookingTime(id_expertise, id_doctor, filter);
  return res.status(httpStatus.OK).json(responseData(data));
});

module.exports = {
  booking,
  updateBooking,
  listBookings,
  listBookingsForStaff,
  getDetailBooking,
  getDetailBookingForStaff,
  cancelBooking,
  updateBookingDoctor,
  staffCreateBooking,
  scheduleBookingTimeCount,
};
