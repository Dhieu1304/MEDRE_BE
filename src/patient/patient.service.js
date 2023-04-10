//const ApiError = require('../utils/ApiError');
//const httpStatus = require('http-status');
const logger = require('../config/logger');
const { v4: uuidv4 } = require('uuid');
const models = require('../models');

const createPatient = async (data) => {
  // generate uuid
  data.id = uuidv4();

  // create new patient
  return models.patient.create(data);
};

const findOneByFilter = async (filter) => {
  try {
    return await models.patient.findOne({ where: filter });
  } catch (e) {
    logger.error(e.message);
  }
};

const findAllByFilter = async (filter) => {
  return await models.patient.findAll({ where: filter });
};

const editPatient = async (id, data) => {
  //find patient and update
  const patient = await findOneByFilter({ id: id });
  if (data.phone_number) {
    await patient.update({ phone_number: data.phone_number });
  }
  if (data.name) {
    await patient.update({ name: data.name });
  }
  if (data.gender) {
    await patient.update({ gender: data.gender });
  }
  if (data.dob) {
    await patient.update({ dob: data.dob });
  }
  if (data.health_insurance) {
    await patient.update({ health_insurance: data.health_insurance });
  }
};

const create = async (data) => {
  return await models.patient.create(data);
};

module.exports = {
  createPatient,
  findOneByFilter,
  findAllByFilter,
  editPatient,
  create,
};
