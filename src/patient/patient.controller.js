const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage } = require('../utils/responseFormat');
const patientService = require('./patient.service');
const pick = require('../utils/pick');
const sequelize = require('../config/database');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const i18next = require('i18next');

const getDetailPatient = catchAsync(async (req, res) => {
  const patient = await patientService.findOneByFilter({ id: req.params.id });
  if (!patient) {
    return res.status(httpStatus.OK).json(responseMessage(i18next.t('patient.notFound'), false));
  }
  return res.status(httpStatus.OK).json(responseData(patient));
});

const listPatient = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['id', 'phone_number', 'name']);
  filter.id_user = req.user.id;
  if (filter.phone_number) {
    filter.phone_number = { [Op.substring]: filter.phone_number };
  }
  if (filter.name) {
    filter.name = sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + filter.name + '%');
  }
  const patients = await patientService.findAllByFilter(filter);
  return res.status(httpStatus.OK).json(responseData(patients));
});

const createPatient = catchAsync(async (req, res) => {
  const data = pick(req.body, ['phone_number', 'name', 'gender', 'address', 'dob', 'health_insurance']);
  data.id = uuidv4();
  data.id_user = req.user.id;
  const newPatient = await patientService.create(data);
  return res.status(httpStatus.OK).json(responseData(newPatient));
});

module.exports = {
  getDetailPatient,
  listPatient,
  createPatient,
};
