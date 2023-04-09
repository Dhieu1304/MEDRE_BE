const express = require('express');
const scheduleController = require('./schedule.controller');
const validate = require('../middlewares/validate');
const scheduleValidation = require('./schedule.validation');
const { staffPermission } = require('../middlewares/staffPermission');
const auth = require('../middlewares/auth');
const { STAFF_ROLES } = require('../staff/staff.constant');

const router = express.Router();

router.get('/list-by-date', validate(scheduleValidation.listByDay), scheduleController.listByDay);
router.get('/list-all', validate(scheduleValidation.listAll), scheduleController.listAll);

// -------------------------------- ADMIN ROUTE ------------------------------------
router.post(
  '/create-schedule',
  auth(),
  staffPermission([STAFF_ROLES.ADMIN]),
  validate(scheduleValidation.createSchedule),
  scheduleController.createSchedule
);
module.exports = router;
