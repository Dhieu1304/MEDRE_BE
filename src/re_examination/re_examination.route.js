const express = require('express');
const reExaminationController = require('./re_examination.controller');
const validate = require('../middlewares/validate');
const reExaminationValidation = require('./re_examination.validation');
const { staffPermission } = require('../middlewares/staffPermission');
const auth = require('../middlewares/auth');
const { ALL_STAFF_ROLES } = require('../staff/staff.constant');

const router = express.Router();
router.use(auth());

router.get('/list', reExaminationController.list);

// -------------------------------- ADMIN ROUTE ------------------------------------
router.get(
  '/list-for-staff',
  staffPermission(ALL_STAFF_ROLES),
  validate(reExaminationValidation.list),
  reExaminationController.listForStaff
);

router.post(
  '/create',
  staffPermission(ALL_STAFF_ROLES),
  validate(reExaminationValidation.create),
  reExaminationController.create
);

module.exports = router;
