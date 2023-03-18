const express = require('express');
const timeScheduleController = require('./time_schedule.controller');

const router = express.Router();

router.get('/time', timeScheduleController.getTimeSchedule);

module.exports = router;
