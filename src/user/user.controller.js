const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage, paginationFormat} = require('../utils/responseFormat');
const userService = require('./user.service');
const Joi = require("joi");
const pageLimit2Offset = require("../utils/pageLimit2Offset");
const pick = require("../utils/pick");
const sequelize = require("../config/database");

const getInfo = catchAsync(async (req, res) => {
  let user = await userService.findOneByFilter({ id: req.user.id });
  if (!user) {
    return res.status(httpStatus.OK).json(responseMessage('User not found', false));
  }
  user = user.toJSON();
  delete user.password;
  delete user.refresh_token;
  return res.status(httpStatus.OK).json(responseData(user));
});

const getDetailUser = catchAsync(async (req, res) => {
  const user = await userService.findOneByFilter({ id: req.params.id });
  if (!user) {
    return res.status(httpStatus.OK).json(responseMessage('User not found', false));
  }
  return res.status(httpStatus.OK).json(responseData(user));
});

const getAll = catchAsync(async (req, res) => {
  const { gender, page, limit } = req.query;
  const filter = pick(req.query, ["phone_number","email","name","address"]);
  for (let key in filter) {
    filter[key] = sequelize.where(
        sequelize.fn('LOWER', sequelize.col(key)), 'LIKE', '%' + filter[key] + '%');
  }
  if (gender) {
    filter.gender = gender;
  }
  const condition = {
    where: filter,
    ...pageLimit2Offset(page, limit)
  }
  const users = await userService.findAndCountAllByCondition(condition);
  return res.status(httpStatus.OK).json(responseData(paginationFormat(users, page, limit)));
});

const editProfile = catchAsync(async (req, res) => {
  const id = req.user.id;
  const user = await userService.editUser(id, req.body);
  return res.status(httpStatus.OK).json(responseData(user, "Change profile successfully."));
});

const changePassword = catchAsync(async (req, res) => {
  const id = req.user.id;
  const user = await userService.changePassword(id, req.body);
  return res.status(httpStatus.OK).json(responseData(user, "Change password successfully."));
});

module.exports = {
  getInfo,
  getDetailUser,
  getAll,
  editProfile,
  changePassword,
};
