const express = require('express');
const doctorTimeOffController = require('./doctor_time_off.controller');

const router = express.Router();

router.get('/time-off', doctorTimeOffController.getDoctorTimeOff);

module.exports = router;
