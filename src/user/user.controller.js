const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, paginationFormat } = require('../utils/responseFormat');
const userService = require('./user.service');
const pageLimit2Offset = require('../utils/pageLimit2Offset');
const pick = require('../utils/pick');
const sequelize = require('../config/database');

const toResponseObject = (user) => {
  const result = user.toJSON();
  delete result.password;
  delete result.refresh_token;
  return result;
};

const getInfo = catchAsync(async (req, res) => {
  const user = await userService.getUserInfo({ where: { id: req.user.id } });
  return res.status(httpStatus.OK).json(responseData(toResponseObject(user)));
});

const getDetailUser = catchAsync(async (req, res) => {
  const user = await userService.getUserInfo({ where: { id: req.params.id } });
  return res.status(httpStatus.OK).json(responseData(toResponseObject(user)));
});

const editUser = catchAsync(async (req, res) => {
  const user = await userService.editUser(req.params.id, req.body);
  return res.status(httpStatus.OK).json(responseData(toResponseObject(user), 'Update user successfully'));
});

const getAll = catchAsync(async (req, res) => {
  const { gender, page, limit } = req.query;
  const filter = pick(req.query, ['phone_number', 'email', 'name', 'address']);
  for (let key in filter) {
    filter[key] = sequelize.where(sequelize.fn('LOWER', sequelize.col(key)), 'LIKE', '%' + filter[key] + '%');
  }
  if (gender) {
    filter.gender = gender;
  }
  const condition = {
    where: filter,
    ...pageLimit2Offset(page, limit),
  };
  const users = await userService.findAndCountAllByCondition(condition);
  return res.status(httpStatus.OK).json(responseData(paginationFormat(users, page, limit)));
});

const editProfile = catchAsync(async (req, res) => {
  const user = await userService.editUser(req.user.id, req.body);
  return res.status(httpStatus.OK).json(responseData(toResponseObject(user), 'Change profile successfully.'));
});

const changePassword = catchAsync(async (req, res) => {
  const user = await userService.changePassword(req.user.id, req.body);
  return res.status(httpStatus.OK).json(responseData(toResponseObject(user), 'Change password successfully.'));
});

module.exports = {
  getInfo,
  getDetailUser,
  getAll,
  editProfile,
  changePassword,
  editUser,
};
