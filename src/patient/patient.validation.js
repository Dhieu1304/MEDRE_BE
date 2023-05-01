const Joi = require('joi');
const { GENDERS } = require('../user/user.constant');
const { phoneNumberFormat } = require('../utils/messageCustom');

const editPatient = {
  body: Joi.object().keys({
    id_user: Joi.string().uuid(),
    phone_number: Joi.string().custom(phoneNumberFormat),
    name: Joi.string(),
    gender: Joi.string().valid(...Object.values(GENDERS)),
    dob: Joi.date(),
    health_insurance: Joi.string(),
  }),
  params: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
};

const list = {
  query: Joi.object().keys({
    phone_number: Joi.string().custom(phoneNumberFormat),
    name: Joi.string().lowercase().trim(),
    dob: Joi.date(),
    gender: Joi.string().valid(...Object.values(GENDERS)),
    page: Joi.number().integer().default(1).min(1),
    limit: Joi.number().integer().default(10).min(1),
  }),
};

const listForStaff = {
  query: Joi.object().keys({
    id_user: Joi.string().uuid(),
    phone_number: Joi.string().custom(phoneNumberFormat),
    name: Joi.string().lowercase().trim(),
    dob: Joi.date(),
    gender: Joi.string().valid(...Object.values(GENDERS)),
    page: Joi.number().integer().default(1).min(1),
    limit: Joi.number().integer().default(10).min(1),
  }),
};

const create = {
  body: Joi.object().keys({
    phone_number: Joi.string().custom(phoneNumberFormat).required(),
    name: Joi.string().required().trim(),
    gender: Joi.string()
      .valid(...Object.values(GENDERS))
      .default(GENDERS.OTHER).required(),
    address: Joi.string().required(),
    dob: Joi.date().required(),
    health_insurance: Joi.string().trim(),
  }),
};

const detailPatient = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
};

module.exports = {
  list,
  listForStaff,
  detailPatient,
  editPatient,
  create,
};
