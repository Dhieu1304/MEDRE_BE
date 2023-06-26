const express = require('express');
const validate = require('../middlewares/validate');
const statisticController = require('./statistic.controller');
const statisticValidation = require('./statistic.validation');

const router = express.Router();

router.get('/booking', validate(statisticValidation.statisticBooking), statisticController.statisticBooking);

module.exports = router;
