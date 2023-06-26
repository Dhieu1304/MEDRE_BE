const express = require('express');
const validate = require('../middlewares/validate');
const statisticController = require('./statistic.controller');
const statisticValidation = require('./statistic.validation');

const router = express.Router();

router.get('/booking', validate(statisticValidation.statisticBy), statisticController.statisticBooking);
router.get('/user', validate(statisticValidation.statisticBy), statisticController.statisticUser);
router.get('/patient', validate(statisticValidation.statisticBy), statisticController.statisticPatient);

module.exports = router;
