const Joi = require('joi');
const { GENDERS } = require('../user/user.constant');
const { phoneNumberFormat } = require('../utils/messageCustom');
const { password } = require('../utils/validateCustom');

const editUser = {
  body: Joi.object().keys({
    phone_number: Joi.string().required().custom(phoneNumberFormat),
    email: Joi.string().email().lowercase(),
    name: Joi.string().trim(),
    image: Joi.string().trim(),
    address: Joi.string().trim(),
    gender: Joi.string().valid(...Object.values(GENDERS)),
    dob: Joi.date(),
    health_insurance: Joi.string().trim(),
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
    phone_number: Joi.string().custom(phoneNumberFormat),
    email: Joi.string().email().lowercase(),
    name: Joi.string().trim().lowercase(),
    gender: Joi.string().valid(...Object.values(GENDERS)),
    address: Joi.string(),
    blocked: Joi.boolean(),
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
