const Joi = require('joi');
const { GENDERS } = require('../user/user.constant');
const { phoneNumberRegex } = require('../utils/validateCustom');

// const createPatient = {
//   body: Joi.object().keys({
//     id_user: Joi.string().required(),
//     phone_number: Joi.string().required(),
//     name: Joi.string().required(),
//     gender: Joi.string()
//       .valid(...Object.values(GENDERS))
//       .default(GENDERS.OTHER),
//     dob: Joi.date(),
//     health_insurance: Joi.string(),
//   }),
// };

const editPatient = {
  body: Joi.object().keys({
    id_user: Joi.string(),
    phone_number: Joi.string(),
    name: Joi.string(),
    gender: Joi.string().valid(...Object.values(GENDERS)),
    dob: Joi.date(),
    health_insurance: Joi.string(),
  }),
};

const list = {
  query: Joi.object().keys({
    id: Joi.string().uuid(),
    phone_number: Joi.string().regex(phoneNumberRegex).message('Invalid phone number format'),
    name: Joi.string().lowercase().trim(),
    dob: Joi.date(),
  }),
};

const create = {
  body: Joi.object().keys({
    phone_number: Joi.string().regex(phoneNumberRegex).message('Invalid phone number format'),
    name: Joi.string().required().trim(),
    gender: Joi.string()
      .valid(...Object.values(GENDERS))
      .default(GENDERS.OTHER),
    address: Joi.string(),
    dob: Joi.date().required(),
    health_insurance: Joi.string().trim(),
  }),
};

module.exports = {
  // admin
  //createPatient,
  editPatient,
  list,
  create,
};
