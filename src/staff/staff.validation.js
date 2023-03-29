const Joi = require('joi');
const { GENDERS } = require('../user/user.constant');
const { STAFF_ROLES } = require('./staff.constant');
const moment = require('moment');
const { SCHEDULE_TYPE } = require('../schedule/schedule.constant');

const getAllStaff = {
  query: Joi.object().keys({
    username: Joi.string(),
    phone_number: Joi.string(),
    email: Joi.string(),
    name: Joi.string(),
    address: Joi.string(),
    gender: Joi.string().valid(...Object.values(GENDERS)),
    role: Joi.string().valid(...Object.values(STAFF_ROLES)),
    type: Joi.string().valid(...Object.values(SCHEDULE_TYPE)),
    from: Joi.date(),
    to: Joi.date(),
    expertise: Joi.array().items(Joi.string().uuid()),
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
  }),
};

const createStaff = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    phone_number: Joi.string().required(),
    email: Joi.string(),
    password: Joi.string().required(),
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
    id_account: Joi.string().required(),
    reason: Joi.string(),
  }),
};

const editStaff = {
  body: Joi.object().keys({
    username: Joi.string(),
    phone_number: Joi.string(),
    email: Joi.string(),
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
  }),
};

module.exports = {
  getAllStaff,
  getDetailStaff,

  // admin
  createStaff,
  blockAccount,
  editStaff,
};
