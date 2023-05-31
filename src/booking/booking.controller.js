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
const { getGlobalSettingByName } = require('../nodeCache/globalSetting');
const { GLOBAL_SETTING } = require('../global_setting/global_setting.constant');

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
  include.push({
    model: models.checkup_package,
    as: 'booking_checkup_package',
    attributes: ['name', 'description', 'price'],
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
  include.push({
    model: models.checkup_package,
    as: 'booking_checkup_package',
    attributes: ['name', 'description', 'price'],
  });
  delete filter.id_doctor;

  // convert filter type
  if (filter.type) {
    include[include.length - 1].where.type = filter.type;
    include[include.length - 1].required = true;
    delete filter.type;
  }
  include.push({ model: models.user, as: 'booking_of_user', attributes: { exclude: ['password'] } });
  include.push({ model: models.patient, as: 'booking_of_patient' });

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
      {
        model: models.checkup_package,
        as: 'booking_checkup_package',
        attributes: ['name', 'description', 'price'],
      },
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
      {
        model: models.checkup_package,
        as: 'booking_checkup_package',
        attributes: ['name', 'description', 'price'],
      },
    ],
  });
  return res.status(httpStatus.OK).json(responseData(booking));
});

const booking = catchAsync(async (req, res) => {
  const data = pick(req.body, ['id_schedule', 'id_time', 'date', 'reason', 'id_patient', 'id_checkup_package']);

  // check booking date ( > 1 day)
  if (
    data.date < moment().add(getGlobalSettingByName(GLOBAL_SETTING.BOOK_ADVANCE_DAY), 'd') ||
    data.date > moment().add(getGlobalSettingByName(GLOBAL_SETTING.BOOK_AFTER_DAY), 'd')
  ) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('booking.invalidDate'), false));
  }
  //a6819437-95a5-4492-b682-cb13916d00ee
  data.id_user = req.user.id;

  // check book for other people
  if (!data.id_patient) {
    const patient = await patientService.findOrCreatePatientFromUser(req.user.id);
    data.id_patient = patient.id;
  }

  const newBooking = await bookingService.createNewBooking(data);

  // todo: change status to cancel after 30 minute user don't payment

  return res.status(httpStatus.OK).json(responseData(newBooking, i18next.t('booking.booking')));
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
  if (data.date < moment().add(1, 'd')) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('booking.invalidDate'), false));
  }

  // check schedule is offline
  const schedule = await scheduleService.findOneByFilter({ id: data.id_schedule });
  if (!schedule || schedule.type !== SCHEDULE_TYPE.OFFLINE) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('booking.invalidScheduleId'), false));
  }

  data.id_staff_booking = req.user.id;
  data.booking_status = BOOKING_STATUS.BOOKED;
  data.bookedAt = new Date();

  const newBooking = await bookingService.createNewBooking(data);

  return res.status(httpStatus.OK).json(responseData(newBooking, i18next.t('booking.booking')));
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
};
