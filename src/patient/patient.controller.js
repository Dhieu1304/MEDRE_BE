const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage } = require('../utils/responseFormat');
const patientService = require('./patient.service');

const getDetailPatient = catchAsync(async (req, res) => {
  const patient = await patientService.findOneByFilter({ id: req.params.id });
  if (!patient) {
    return res.status(httpStatus.OK).json(responseMessage('Patient not found', false));
  }
  return res.status(httpStatus.OK).json(responseData(patient));
});

const getAll = catchAsync(async (req, res) => {
  const patients = await patientService.findAllByFilter();
  return res.status(httpStatus.OK).json(responseData(patients));
});

module.exports = {
  getDetailPatient ,
  getAll,
};
