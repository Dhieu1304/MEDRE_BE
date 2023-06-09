const express = require('express');
const scheduleBookingTimeController = require('./schedule_booking_time.controller');
const scheduleBookingTimeValidation = require('./schedule_booking_time.validation');
const validate = require('../middlewares/validate');

const router = express.Router();

router.get('/list', validate(scheduleBookingTimeValidation.getList), scheduleBookingTimeController.getList);
module.exports = router;
