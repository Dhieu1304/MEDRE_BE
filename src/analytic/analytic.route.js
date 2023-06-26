const express = require('express');
const analyticController = require('./analytic.controller');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const { rules } = require('eslint-config-prettier');

const router = express.Router();
//router.use(auth());

router.get('//week-day', analyticController.getRevenueByWeekDisplayDay);
router.get('/month-day', analyticController.getRevenueByMonthDisplayDay);
router.get('/month-week', analyticController.getRevenueByMonthDisplayWeek);
router.get('/year-month', analyticController.getRevenueByYearDisplayMonth);

module.exports = router;