const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage } = require('../utils/responseFormat');
const staffService = require('./staff.service');
const pick = require('../utils/pick');
const { Op } = require('sequelize');

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
  const filter = pick(req.query, ['username', 'phone_number', 'email', 'name', 'address', 'gender', 'role']);
  const filterLike = ['username', 'phone_number', 'email', 'name', 'address'];
  for (let i = 0; i < filterLike.length; i++) {
    if (filter[filterLike[i]]) {
      filter[filterLike[i]] = {
        [Op.like]: `%${filter[filterLike[i]]}%`,
      };
    }
  }
  const condition = {
    where: filter,
    limit: req.query.limit,
    offset: (req.query.page - 1) * req.query.limit,
  };

  const staffs = await staffService.findAndCountAllByCondition(condition);
  console.log(staffs);
  return res.status(httpStatus.OK).json(responseData(staffs));
});

const getDetailStaff = catchAsync(async (req, res) => {
  const { from, to } = req.query;
  const drs = await staffService.findDetailStaff(req.params.id, from, to);
  if (!drs) {
    return res.status(httpStatus.OK).json(responseMessage('Not found', false));
  }
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
