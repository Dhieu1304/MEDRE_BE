const express = require('express');
const scheduleController = require('./schedule.controller');
const validate = require('../middlewares/validate');
const scheduleValidation = require('./schedule.validation');

const router = express.Router();

router.get('/list-by-date', validate(scheduleValidation.listByDay), scheduleController.listByDay);
router.get('/list-from-to', validate(scheduleValidation.listFromTo), scheduleController.listFromTo);

module.exports = router;
