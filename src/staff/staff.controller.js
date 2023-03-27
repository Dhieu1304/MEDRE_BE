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
    return res.status(httpStatus.OK).json(responseMessage('Staff not found', false));
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
  const drs = await staffService.findOneByFilter({ id: req.params.id });
  if (!drs) {
    return res.status(httpStatus.OK).json(responseMessage('Not found', false));
  }
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

module.exports = {
  getInfo,
  getAll,
  getDetailStaff,

  // admin
  createStaff,
  blockingAccount,
  unblockingAccount,
};
