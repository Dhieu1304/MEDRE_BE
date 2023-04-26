const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage, paginationFormat } = require('../utils/responseFormat');
const staffService = require('./staff.service');
const pick = require('../utils/pick');
const { Op } = require('sequelize');
const models = require('../models');
const sequelize = require('../config/database');
const pageLimit2Offset = require('../utils/pageLimit2Offset');
const moment = require('moment');
const { BOOKING_STATUS } = require('../booking/booking.constant');
const i18next = require('i18next');
const authService = require('../auth/auth.service');
const { regexpRepeatOnFromTo } = require('../utils/regexpRepeatOnFromTo');

const toResponseObject = (staff) => {
  const result = staff.toJSON();
  delete result.password;
  delete result.refresh_token;
  return result;
};

const getInfo = catchAsync(async (req, res) => {
  const staff = await staffService.getStaffInfo({
    where: { id: req.user.id },
    include: [{ model: models.expertise, as: 'expertises' }],
  });
  return res.status(httpStatus.OK).json(responseData(toResponseObject(staff)));
});

const getAll = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const filter = pick(req.query, [
    'phone_number',
    'email',
    'name',
    'address',
    'blocked',
    'gender',
    'role',
    'type',
    'from',
    'to',
    'expertise',
  ]);

  const filterLike = ['phone_number', 'email', 'address'];
  for (let i = 0; i < filterLike.length; i++) {
    if (filter[filterLike[i]]) {
      filter[filterLike[i]] = { [Op.substring]: filter[filterLike[i]] };
    }
  }

  if (filter.name) {
    filter.name = sequelize.where(sequelize.fn('LOWER', sequelize.col('staff.name')), 'LIKE', `%${filter.name}%`);
  }

  const include = [];
  if (filter.from || filter.to || filter.type) {
    include.push({ model: models.schedule, as: 'staff_schedules', where: {} });
  }
  if (filter.type) {
    include[0].where.type = filter.type;
    delete filter.type;
  }

  if (filter.from) {
    // include[0].where.apply_to = { [Op.gte]: filter.from };
    delete filter.from;
  }

  if (filter.to) {
    include[0].where.apply_to = { [Op.gte]: filter.to };
    delete filter.to;
  }

  include.push({ model: models.expertise, as: 'expertises', required: false, where: {} });
  if (filter.expertise) {
    include[include.length - 1].where.id = filter.expertise;
    include[include.length - 1].required = true;
    delete filter.expertise;
  }

  const condition = {
    where: filter,
    include,
    distinct: true,
    ...pageLimit2Offset(page, limit),
    attributes: { exclude: ['password', 'refresh_token'] },
  };

  const staffs = await staffService.findAndCountAllByCondition(condition);
  return res.status(httpStatus.OK).json(responseData(paginationFormat(staffs, page, limit)));
});

const getListStaffSchedule = catchAsync(async (req, res) => {
  const { page, limit, date } = req.query;
  const condition = {
    include: [
      {
        model: models.schedule,
        as: 'staff_schedules',
        where: {
          repeat_on: { [Op.substring]: moment(date).day() },
          apply_from: { [Op.lte]: date },
          apply_to: { [Op.gte]: date },
        },
        include: [
          {
            model: models.booking,
            as: 'bookings',
            required: false,
            where: { booking_status: { [Op.ne]: BOOKING_STATUS.CANCELED }, date },
          },
        ],
      },
      {
        model: models.doctor_time_off,
        as: 'time_offs',
        required: false,
        where: { [Op.and]: [{ from: { [Op.lte]: date } }, { to: { [Op.gte]: date } }] },
      },
    ],
    distinct: true,
    ...pageLimit2Offset(page, limit),
    attributes: { exclude: ['password', 'refresh_token'] },
  };

  const staffs = await staffService.findAndCountAllByCondition(condition);
  return res.status(httpStatus.OK).json(responseData(paginationFormat(staffs, page, limit)));
});

const getDetailStaff = catchAsync(async (req, res) => {
  const { from, to } = req.query;
  const filterSchedule = {
    [Op.not]: { [Op.or]: [{ apply_from: { [Op.gt]: to } }, { apply_to: { [Op.lt]: from } }] },
  };

  const regexpRepeatOn = regexpRepeatOnFromTo(from, to);
  if (!regexpRepeatOn.status) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage(regexpRepeatOn.data, false));
  } else if (regexpRepeatOn.data) {
    filterSchedule.repeat_on = { [Op.regexp]: regexpRepeatOn.data };
  }

  const options = {
    where: { id: req.params.id },
    include: [
      {
        model: models.schedule,
        as: 'staff_schedules',
        where: filterSchedule,
        required: false,
        include: [
          {
            model: models.booking,
            as: 'bookings',
            required: false,
            where: {
              booking_status: { [Op.ne]: BOOKING_STATUS.CANCELED },
              date: { [Op.between]: [from, to] },
            },
            include: [
              {
                model: models.time_schedule,
                as: 'booking_time_schedule',
                attributes: { exclude: ['createdAt', 'updatedAt'] },
              },
            ],
          },
          { model: models.expertise, as: 'schedule_expertise', attributes: { exclude: ['createdAt', 'updatedAt'] } },
        ],
      },
      {
        model: models.doctor_time_off,
        as: 'time_offs',
        required: false,
        where: { [Op.not]: { [Op.or]: [{ from: { [Op.gt]: to } }, { to: { [Op.lt]: from } }] } },
      },
      {
        model: models.expertise,
        as: 'expertises',
      },
    ],
    attributes: { exclude: ['password', 'refresh_token'] },
  };
  const staff = await staffService.findOneByOption(options);
  return res.status(httpStatus.OK).json(responseData(staff));
});

const getDetailStaffByDate = catchAsync(async (req, res) => {
  const { date } = req.query;
  const options = {
    where: { id: req.params.id },
    include: [
      {
        model: models.schedule,
        as: 'staff_schedules',
        where: {
          apply_from: { [Op.lte]: date },
          apply_to: { [Op.gte]: date },
          repeat_on: { [Op.substring]: moment(date).day() },
        },
        required: false,
        include: [
          {
            model: models.booking,
            as: 'bookings',
            required: false,
            where: {
              booking_status: { [Op.ne]: BOOKING_STATUS.CANCELED },
              date,
            },
            include: [
              {
                model: models.time_schedule,
                as: 'booking_time_schedule',
                attributes: { exclude: ['createdAt', 'updatedAt'] },
              },
            ],
          },
          { model: models.expertise, as: 'schedule_expertise', attributes: { exclude: ['createdAt', 'updatedAt'] } },
        ],
      },
      {
        model: models.doctor_time_off,
        as: 'time_offs',
        required: false,
        where: { [Op.and]: [{ from: { [Op.lte]: date } }, { to: { [Op.gte]: date } }] },
      },
      {
        model: models.expertise,
        as: 'expertises',
      },
    ],
    attributes: { exclude: ['password', 'refresh_token'] },
  };
  const staff = await staffService.findOneByOption(options);
  return res.status(httpStatus.OK).json(responseData(staff));
});

const createStaff = catchAsync(async (req, res) => {
  const staff = await staffService.createStaff(req.body);
  const mail = req.body.email;
  res.status(httpStatus.OK).json(responseData(toResponseObject(staff), i18next.t('account.create')));
  // only running underground
  if (mail) {
    await authService.sendMailVerification(mail, 2);
  }
});

const blockingAccount = catchAsync(async (req, res) => {
  const staffId = req.user.id;
  const data = pick(req.body, ['id_account', 'reason']);
  await staffService.blockingAccount(staffId, data);
  return res.status(httpStatus.OK).json(responseMessage(i18next.t('block.blocked'), true));
});

const unblockingAccount = catchAsync(async (req, res) => {
  const staffId = req.user.id;
  const data = pick(req.body, ['id_account', 'reason']);
  await staffService.unblockingAccount(staffId, data);
  return res.status(httpStatus.OK).json(responseMessage(i18next.t('block.unblocked'), true));
});

const editAccountInfo = catchAsync(async (req, res) => {
  const staffId = req.user.id;
  const staff = await staffService.editStaff(staffId, req.params.id, req.body);
  return res.status(httpStatus.OK).json(responseData(toResponseObject(staff), i18next.t('account.update')));
});

const editProfile = catchAsync(async (req, res) => {
  const id = req.user.id;
  const staff = await staffService.editStaff(id, req.body);
  return res.status(httpStatus.OK).json(responseData(toResponseObject(staff), i18next.t('account.changeProfile')));
});

const changePassword = catchAsync(async (req, res) => {
  const id = req.user.id;
  const staff = await staffService.changePassword(id, req.body);
  return res.status(httpStatus.OK).json(responseData(toResponseObject(staff), i18next.t('password.changePassword')));
});

module.exports = {
  getInfo,
  getAll,
  getDetailStaff,
  getDetailStaffByDate,
  getListStaffSchedule,
  editProfile,
  changePassword,

  // admin
  createStaff,
  blockingAccount,
  unblockingAccount,
  editAccountInfo,
};
