const Joi = require('joi');
const { GENDERS } = require('../user/user.constant');

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

module.exports = {
  // admin
  //createPatient,
  editPatient,
};
