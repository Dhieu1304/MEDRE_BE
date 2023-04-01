const express = require('express');
const auth = require('../middlewares/auth');
const patientController = require('./patient.controller');
const validate = require('../middlewares/validate');
const patientValidation = require('./patient.validation');
const { staffPermission } = require('../middlewares/staffPermission');
const { ALL_STAFF_ROLES, STAFF_ROLES } = require('../staff/staff.constant');

const router = express.Router();

router.get('/info', auth(), patientController.getInfo);
router.get('/all', patientController.getAll);

// -------------------------------- ADMIN ROUTE ------------------------------------
router.get('/detail/:id', auth(), staffPermission(ALL_STAFF_ROLES), patientController.getDetailUser);
router.post(
  '/edit/:id',
  auth(),
  validate(patientValidation.editPatient),
  staffPermission([STAFF_ROLES.ADMIN]),
  staffController.editAccountInfo
);

module.exports = router;
