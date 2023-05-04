const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage, paginationFormat } = require('../utils/responseFormat');
const patientService = require('./patient.service');
const pick = require('../utils/pick');
const sequelize = require('../config/database');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const i18next = require('i18next');
const pageLimit2Offset = require('../utils/pageLimit2Offset');

const getDetailPatient = catchAsync(async (req, res) => {
  const patient = await patientService.findOneByFilter({ id: req.params.id, id_user: req.user.id });
  if (!patient) {
    return res.status(httpStatus.OK).json(responseMessage(i18next.t('patient.notFound'), false));
  }
  return res.status(httpStatus.OK).json(responseData(patient));
});

const getDetailPatientForStaff = catchAsync(async (req, res) => {
  const patient = await patientService.findOneByFilter({ id: req.params.id });
  if (!patient) {
    return res.status(httpStatus.OK).json(responseMessage(i18next.t('patient.notFound'), false));
  }
  return res.status(httpStatus.OK).json(responseData(patient));
});

const listPatient = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const filter = pick(req.query, ['phone_number', 'name', 'dob', 'gender']);
  filter.id_user = req.user.id;
  if (filter.phone_number) {
    filter.phone_number = { [Op.substring]: filter.phone_number };
  }
  if (filter.name) {
    filter.name = sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + filter.name + '%');
  }
  const condition = {
    where: filter,
    ...pageLimit2Offset(page, limit),
  };
  const patients = await patientService.findAndCountAllByCondition(condition);
  return res.status(httpStatus.OK).json(responseData(paginationFormat(patients, page, limit)));
});

const listPatientForStaff = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const filter = pick(req.query, ['id_user', 'phone_number', 'name', 'dob', 'gender']);
  if (filter.phone_number) {
    filter.phone_number = { [Op.substring]: filter.phone_number };
  }
  if (filter.name) {
    filter.name = sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + filter.name + '%');
  }
  const condition = {
    where: filter,
    ...pageLimit2Offset(page, limit),
  };
  const patients = await patientService.findAndCountAllByCondition(condition);
  return res.status(httpStatus.OK).json(responseData(paginationFormat(patients, page, limit)));
});

const createPatient = catchAsync(async (req, res) => {
  const data = pick(req.body, ['phone_number', 'name', 'gender', 'address', 'dob', 'health_insurance']);
  data.id = uuidv4();
  data.id_user = req.user.id;
  const newPatient = await patientService.createPatient(data);
  return res.status(httpStatus.OK).json(responseData(newPatient));
});

const editPatient = catchAsync(async (req, res) => {
  const data = pick(req.body, ['id_user', 'phone_number', 'name', 'gender', 'address', 'dob', 'health_insurance']);
  const updatePatient = await patientService.updatePatient(req.params.id, data);
  return res.status(httpStatus.OK).json(responseData(updatePatient));
});

module.exports = {
  getDetailPatient,
  getDetailPatientForStaff,
  listPatient,
  listPatientForStaff,
  createPatient,
  editPatient,
};
