const express = require('express');
const staffController = require('./staff.controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { staffPermission } = require('../middlewares/staffPermission');
const { STAFF_ROLES } = require('./staff.constant');
const staffValidation = require('./staff.validation');

const router = express.Router();

router.get('/info', auth(), staffController.getInfo);
router.get('/all', staffController.getAll);
router.get('/doctors', staffController.getAllDoctor);

// -------------------------------- ADMIN ROUTE ------------------------------------
router.post(
  '/create',
  auth(),
  validate(staffValidation.createStaff),
  staffPermission([STAFF_ROLES.ADMIN]),
  staffController.createStaff
);

module.exports = router;
