const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage, paginationFormat } = require('../utils/responseFormat');
const staffService = require('./staff.service');
const pick = require('../utils/pick');
const { Op } = require('sequelize');
const scheduleService = require('../schedule/schedule.service');
const userService = require('../user/user.service');
const patientService = require('../patient/patient.service');
const models = require('../models');
const sequelize = require('../config/database');
const pageLimit2Offset = require('../utils/pageLimit2Offset');

const toResponseObject = (staff) => {
  const result = staff.toJSON();
  delete result.password;
  delete result.refresh_token;
  return result;
};

const getInfo = catchAsync(async (req, res) => {
  const staff = await staffService.getStaffInfo({
    where: { id: req.user.id },
    include: [{model: models.expertise, as: 'expertises' }],
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
    'gender',
    'role',
    'type',
    'from',
    'to',
    'expertise',
  ]);

  const filterLike = ['phone_number', 'email', 'name', 'address'];
  for (let i = 0; i < filterLike.length; i++) {
    if (filter[filterLike[i]]) {
      filter[filterLike[i]] = sequelize.where(
        sequelize.fn('LOWER', sequelize.col(filterLike[i])),
        'LIKE',
        '%' + filter[filterLike[i]] + '%'
      );
    }
  }

  const include = [];
  if (filter.from || filter.to || filter.type) {
    include.push({ model: models.schedule, as: 'staff_schedules', where: {} });
  }
  if (filter.type) {
    include[0].where.type = filter.type;
  }

  if (filter.from) {
    if (filter.to) {
      const objectFilterDate = { [Op.and]: [{ date: { [Op.gte]: filter.from } }, { date: { [Op.lte]: filter.to } }] };
      Object.assign(include[0].where, objectFilterDate);
    } else {
      include[0].where.date = { [Op.gte]: filter.from };
    }
  } else if (filter.to) {
    include[0].where.date = { [Op.lte]: filter.to };
  }

  delete filter.from;
  delete filter.to;
  delete filter.type;

  include.push({ model: models.expertise, as: 'expertises', required: false, where: { } });
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
  const { page, limit, from, to } = req.query;

  // todo: no generate schedule -> query all
  const condition = {
    include: [
      {
        model: models.schedule,
        as: 'staff_schedules',
        where: {
          [Op.and]: [{ date: { [Op.gte]: from } }, { date: { [Op.lte]: to } }],
        },
      },
    ],
    distinct: true,
    ...pageLimit2Offset(page, limit),
    attributes: ['id'],
    raw: true,
  };

  const staffs = await staffService.findAndCountAllByCondition(condition);
  const listId = staffs.rows.map((item) => {
    return item.id;
  });

  // find by format
  staffs.rows = await staffService.getListStaffSchedule([...new Set(listId)]);
  return res.status(httpStatus.OK).json(responseData(paginationFormat(staffs, page, limit)));
});

const getDetailStaff = catchAsync(async (req, res) => {
  const { from, to } = req.query;
  let drs = await staffService.findDetailStaff({ id: req.params.id });
  if (!drs) {
    return res.status(httpStatus.OK).json(responseMessage('Not found', false));
  }
  drs = drs.toJSON();
  drs.schedules = await scheduleService.findAllByFilterBookingDetail({
    id_doctor: req.params.id,
    [Op.and]: [{ date: { [Op.gte]: from } }, { date: { [Op.lte]: to } }],
  });
  return res.status(httpStatus.OK).json(responseData(drs));
});

const createStaff = catchAsync(async (req, res) => {
  const staff = await staffService.createStaff(req.body);
  return res.status(httpStatus.OK).json(responseData(staff, 'Create new staff successfully'));
});

const blockingAccount = catchAsync(async (req, res) => {
  const staffId = req.user.id;
  //const staffId = "353066b6-4bb7-4df8-8f46-88f71bf6a182";
  const data = pick(req.body, ['id_account', 'reason']);
  await staffService.blockingAccount(staffId, data);
  return res.status(httpStatus.OK).json(responseMessage('Blocked account', true));
});

const unblockingAccount = catchAsync(async (req, res) => {
  const staffId = req.user.id;
  const data = pick(req.body, ['id_account', 'reason']);
  await staffService.unblockingAccount(staffId, data);
  return res.status(httpStatus.OK).json(responseMessage('Unblocked account', true));
});

const editAccountInfo = catchAsync(async (req, res) => {
  const id = req.params.id;
  const role = await staffService.getRole(id);
  var account;
  if (role === 'User') {
    account = await userService.editUser(id, req.body);
  } else if (role === 'Patient') {
    account = await patientService.editPatient(id, req.body);
  } else {
    account = await staffService.editStaff(id, req.body);
  }
  return res.status(httpStatus.OK).json(responseData(account, 'Update account successfully'));
});

const editProfile = catchAsync(async (req, res) => {
  const id = req.user.id;
  const staff = await staffService.editStaff(id, req.body);
  return res.status(httpStatus.OK).json(responseData(staff, 'Change profile successfully.'));
});

const changePassword = catchAsync(async (req, res) => {
  const id = req.user.id;
  const staff = await staffService.changePassword(id, req.body);
  return res.status(httpStatus.OK).json(responseData(staff, 'Change password successfully.'));
});

module.exports = {
  getInfo,
  getAll,
  getDetailStaff,
  getListStaffSchedule,
  editProfile,
  changePassword,

  // admin
  createStaff,
  blockingAccount,
  unblockingAccount,
  editAccountInfo,
};
