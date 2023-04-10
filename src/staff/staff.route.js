const express = require('express');
const staffController = require('./staff.controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { staffPermission } = require('../middlewares/staffPermission');
const { STAFF_ROLES } = require('./staff.constant');
const staffValidation = require('./staff.validation');

const router = express.Router();

router.get('/all', validate(staffValidation.getAllStaff), staffController.getAll);
router.get('/list-staff-schedule', validate(staffValidation.getListStaffSchedule), staffController.getListStaffSchedule);
router.get('/detail/:id', validate(staffValidation.getDetailStaff), staffController.getDetailStaff);

router.get('/my-profile', auth(), staffController.getInfo);

router.post(
  '/my-profile/edit',
  //auth(),
  validate(staffValidation.editStaff),
  staffController.editProfile
);

router.post(
  '/my-profile/change-password',
  //auth(),
  validate(staffValidation.changePassword),
  staffController.changePassword
);

// -------------------------------- ADMIN ROUTE ------------------------------------
router.post(
  '/create',
  auth(),
  validate(staffValidation.createStaff),
  staffPermission([STAFF_ROLES.ADMIN]),
  staffController.createStaff
);

router.post('/confirm-blocking', auth(), validate(staffValidation.blockAccount), staffController.blockingAccount);

router.post(
  '/confirm-unblocking',
  auth(),
  validate(staffValidation.blockAccount),
  staffPermission([STAFF_ROLES.ADMIN]),
  staffController.unblockingAccount
);

router.post(
  '/edit/:id',
  auth(),
  validate(staffValidation.editStaff),
  staffPermission([STAFF_ROLES.ADMIN]),
  staffController.editAccountInfo
);

module.exports = router;
