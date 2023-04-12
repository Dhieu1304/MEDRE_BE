const Joi = require('joi');
const { GENDERS } = require('../user/user.constant');
const { STAFF_ROLES } = require('./staff.constant');
const moment = require('moment');
const { SCHEDULE_TYPE } = require('../schedule/schedule.constant');
const { phoneNumberRegex } = require('../utils/validateCustom');
const { password } = require('../utils/validateCustom');

const getAllStaff = {
  query: Joi.object().keys({
    phone_number: Joi.string().regex(phoneNumberRegex).message('Invalid phone number format'),
    email: Joi.string().email(),
    name: Joi.string().trim().lowercase(),
    address: Joi.string(),
    gender: Joi.string().valid(...Object.values(GENDERS)),
    role: Joi.string().valid(...Object.values(STAFF_ROLES)),
    type: Joi.string().valid(...Object.values(SCHEDULE_TYPE)),
    from: Joi.date(),
    to: Joi.date(),
    expertise: Joi.array().items(Joi.string().uuid()),
    page: Joi.number().integer().default(1).min(1),
    limit: Joi.number().integer().default(10).min(1),
  }),
};

const getListStaffSchedule = {
  query: Joi.object().keys({
    date: Joi.date().default(moment().startOf('date')),
    page: Joi.number().integer().default(1).min(1),
    limit: Joi.number().integer().default(10).min(1),
  }),
};

const createStaff = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    phone_number: Joi.string().required().regex(phoneNumberRegex).message('Invalid phone number format'),
    email: Joi.string().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    image: Joi.string(),
    address: Joi.string(),
    gender: Joi.string()
      .valid(...Object.values(GENDERS))
      .default(GENDERS.OTHER),
    dob: Joi.date(),
    role: Joi.string()
      .valid(...Object.values(STAFF_ROLES))
      .default(STAFF_ROLES.NURSE),
    health_insurance: Joi.string(),
    description: Joi.string(),
    education: Joi.string(),
    certificate: Joi.string(),
  }),
};

const getDetailStaff = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
  query: Joi.object().keys({
    from: Joi.date().default(moment().startOf('date')),
    to: Joi.date().default(moment().endOf('date')),
  }),
};

const blockAccount = {
  body: Joi.object().keys({
    id_account: Joi.string().uuid().required(),
    reason: Joi.string(),
  }),
};

const editStaff = {
  body: Joi.object().keys({
    username: Joi.string(),
    phone_number: Joi.string().regex(phoneNumberRegex).message('Invalid phone number format'),
    email: Joi.string().email(),
    name: Joi.string(),
    image: Joi.string(),
    address: Joi.string(),
    gender: Joi.string().valid(...Object.values(GENDERS)),
    dob: Joi.date(),
    role: Joi.string().valid(...Object.values(STAFF_ROLES)),
    health_insurance: Joi.string(),
    description: Joi.string(),
    education: Joi.string(),
    certificate: Joi.string(),
    expertise: Joi.array().items(Joi.string().uuid()),
  }),
};

const editProfile = {
  body: Joi.object().keys({
    name: Joi.string(),
    image: Joi.string(),
    address: Joi.string(),
    gender: Joi.string().valid(...Object.values(GENDERS)),
    dob: Joi.date(),
    health_insurance: Joi.string(),
    description: Joi.string(),
    education: Joi.string(),
    certificate: Joi.string(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    old_password: Joi.string().required(),
    new_password: Joi.string().required().custom(password),
    confirm_password: Joi.string().required(),
  }),
};

module.exports = {
  getAllStaff,
  getDetailStaff,
  editProfile,
  getListStaffSchedule,
  changePassword,

  // admin
  createStaff,
  blockAccount,
  editStaff,
};
