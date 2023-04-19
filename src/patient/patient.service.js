const { v4: uuidv4 } = require('uuid');
const models = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const i18next = require('i18next');

const createPatient = async (data) => {
  // generate uuid
  data.id = uuidv4();

  // create new patient
  return models.patient.create(data);
};

const findOneByFilter = async (filter) => {
  return await models.patient.findOne({ where: filter });
};

const findAllByFilter = async (filter) => {
  return await models.patient.findAll({ where: filter });
};

const findAndCountAllByCondition = async (condition) => {
  return await models.patient.findAndCountAll(condition);
};

const create = async (data) => {
  return await models.patient.create(data);
};

const updatePatient = async (id, data) => {
  let patient = await findOneByFilter({ id });
  if (!patient) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('patient.notFound'));
  }

  patient = Object.assign(patient, data);
  return await patient.save();
};

const findOrCreatePatientFromUser = async (id_user) => {
  const user = await models.user.findOne({where: {id: id_user}, raw: true})

  const dataPatient = {};
  const attribute = Object.keys(models.patient.getAttributes());
  attribute.map(item => {
    if (item !== 'id' && item !== 'createdAt' && item !== 'updatedAt' && user[item]) {
        dataPatient[item] = user[item];
      }
  });

  const [patient, created] = await models.patient.findOrCreate({
    where: dataPatient
  });

  return patient;
}

module.exports = {
  createPatient,
  findOneByFilter,
  findAllByFilter,
  create,
  findAndCountAllByCondition,
  updatePatient,
  findOrCreatePatientFromUser,
};
