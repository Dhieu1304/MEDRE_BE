const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, paginationFormat } = require('../utils/responseFormat');
const userService = require('./user.service');
const pageLimit2Offset = require('../utils/pageLimit2Offset');
const pick = require('../utils/pick');
const sequelize = require('../config/database');
const i18next = require('i18next');
const { Op } = require('sequelize');

const toResponseObject = (user) => {
  const result = user.toJSON();
  delete result.password;
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
  return res.status(httpStatus.OK).json(responseData(toResponseObject(user), i18next.t('account.update')));
});

const getAll = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const filter = pick(req.query, ['phone_number', 'email', 'name', 'address', 'blocked', 'gender', 'order']);
  const filterLike = ['phone_number', 'email', 'address'];
  for (let i = 0; i < filterLike.length; i++) {
    if (filter[filterLike[i]]) {
      filter[filterLike[i]] = { [Op.substring]: filter[filterLike[i]] };
    }
  }
  if (filter.name) {
    filter.name = sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', `%${filter.name}%`);
  }

  const order = [];
  if (filter.order) {
    order.push(filter.order.split(':'));
    delete filter.order;
  }

  const condition = {
    where: filter,
    attributes: { exclude: ['password'] },
    order,
    ...pageLimit2Offset(page, limit),
  };
  const users = await userService.findAndCountAllByCondition(condition);
  return res.status(httpStatus.OK).json(responseData(paginationFormat(users, page, limit)));
});

const editProfile = catchAsync(async (req, res) => {
  const user = await userService.editUser(req.user.id, req.body);
  return res.status(httpStatus.OK).json(responseData(toResponseObject(user), i18next.t('account.changeProfile')));
});

const changePassword = catchAsync(async (req, res) => {
  const user = await userService.changePassword(req.user.id, req.body);
  return res.status(httpStatus.OK).json(responseData(toResponseObject(user), i18next.t('password.changePassword')));
});

module.exports = {
  getInfo,
  getDetailUser,
  getAll,
  editProfile,
  changePassword,
  editUser,
};
