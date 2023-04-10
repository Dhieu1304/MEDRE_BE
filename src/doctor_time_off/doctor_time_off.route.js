const express = require('express');
const doctorTimeOffController = require('./doctor_time_off.controller');
const doctorTimeOffValidation = require('./doctor_time_off.validation');
const validate = require('../middlewares/validate');

const router = express.Router();

router.get('/time-off', validate(doctorTimeOffValidation.list), doctorTimeOffController.getDoctorTimeOff);

module.exports = router;
