const express = require('express');
const doctorTimeOffController = require('./doctor_time_off.controller');
const doctorTimeOffValidation = require('./doctor_time_off.validation');
const validate = require('../middlewares/validate');
const auth = require("../middlewares/auth");
const {staffPermission} = require("../middlewares/staffPermission");
const {ALL_STAFF_ROLES} = require("../staff/staff.constant");

const router = express.Router();
router.use(auth());

router.get('/time-off', validate(doctorTimeOffValidation.list), doctorTimeOffController.getDoctorTimeOff);

// ------------------------------ STAFF --------------------------
router.post('/create-time-off',
    staffPermission(ALL_STAFF_ROLES),
    validate(doctorTimeOffValidation.createTimeOff),
    doctorTimeOffController.createTimeOff);

module.exports = router;
