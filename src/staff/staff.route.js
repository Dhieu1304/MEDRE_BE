const express = require('express');
const staffController = require('./staff.controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { staffPermission } = require('../middlewares/staffPermission');
const { STAFF_ROLES } = require('./staff.constant');
const staffValidation = require('./staff.validation');

const router = express.Router();

router.get('/info', auth(), staffController.getInfo);
router.get('/all', validate(staffValidation.getAllStaff), staffController.getAll);
router.get('/detail/:id', staffController.getDetailStaff);

// -------------------------------- ADMIN ROUTE ------------------------------------
router.post(
  '/create',
  auth(),
  validate(staffValidation.createStaff),
  staffPermission([STAFF_ROLES.ADMIN]),
  staffController.createStaff
);

router.post('/confirm-blocking', validate(staffValidation.blockAccount), staffController.blockingAccount);

router.post(
  '/confirm-unblocking',
  validate(staffValidation.blockAccount),
  staffPermission([STAFF_ROLES.ADMIN]),
  staffController.unblockingAccount
);

module.exports = router;
