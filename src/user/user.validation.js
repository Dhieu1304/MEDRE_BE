const Joi = require('joi');
const { GENDERS } = require('../user/user.constant');
const {phoneNumberRegex} = require("../utils/validateCustom");
const { password } = require('../utils/validateCustom');
const {STAFF_ROLES} = require("../staff/staff.constant");
const {SCHEDULE_TYPE} = require("../schedule/schedule.constant");

const editUser = {
  body: Joi.object().keys({
    phone_number: Joi.string().regex(phoneNumberRegex).message('Invalid phone number format'),
    email: Joi.string(),
    name: Joi.string(),
    image: Joi.string(),
    address: Joi.string(),
    gender: Joi.string().valid(...Object.values(GENDERS)),
    dob: Joi.date(),
    health_insurance: Joi.string(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    old_password: Joi.string().required(),
    new_password: Joi.string().required().custom(password),
    confirm_password: Joi.string().required(),
  }),
};

const listUser = {
  query: Joi.object().keys({
    phone_number: Joi.string().regex(phoneNumberRegex).message('Invalid phone number format'),
    email: Joi.string().email(),
    name: Joi.string().trim().lowercase(),
    gender: Joi.string().valid(...Object.values(GENDERS)),
    address: Joi.string(),
    page: Joi.number().integer().default(1).min(1),
    limit: Joi.number().integer().default(10).min(1),
  }),
};

const detailUser = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
};

module.exports = {
  // admin
  editUser,
  changePassword,
  listUser,
  detailUser,
};
