const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage, paginationFormat } = require('../utils/responseFormat');
const staffService = require('./staff.service');
const pick = require('../utils/pick');
const { Op } = require('sequelize');
const scheduleService = require('../schedule/schedule.service');
const models = require('../models');

const getInfo = catchAsync(async (req, res) => {
  // check staff
  const staff = await staffService.findOneByFilter({ id: req.user.id });
  if (!staff) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage('Staff not found', false));
  }

  // find expertise of staff
  const staffId = staff.id;
  const expertise = await staffService.findExpertise({ staffId });
  return res.status(httpStatus.OK).json(responseData({ staff, expertise }));
});

const getAll = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const filter = pick(req.query, [
    'username',
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

  const filterLike = ['username', 'phone_number', 'email', 'name', 'address'];
  for (let i = 0; i < filterLike.length; i++) {
    if (filter[filterLike[i]]) {
      filter[filterLike[i]] = {
        [Op.substring]: `${filter[filterLike[i]]}`,
      };
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

  if (filter.expertise) {
    include.push({ model: models.expertise, as: 'id_expertise_expertises', where: { id: filter.expertise } });
    delete filter.expertise;
  } else {
    include.push({ model: models.expertise, as: 'id_expertise_expertises' });
  }

  const condition = {
    where: filter,
    include,
    distinct: true,
    limit,
    offset: (page - 1) * limit,
  };

  const staffs = await staffService.findAndCountAllByCondition(condition);
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

module.exports = {
  getInfo,
  getAll,
  getDetailStaff,

  // admin
  createStaff,
};
