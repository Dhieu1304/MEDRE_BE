const express = require('express');
const auth = require('../middlewares/auth');
const patientController = require('./patient.controller');
const validate = require('../middlewares/validate');
const patientValidation = require('./patient.validation');
const { staffPermission } = require('../middlewares/staffPermission');
const { ALL_STAFF_ROLES } = require('../staff/staff.constant');

const router = express.Router();
router.use(auth());

router.get('/list', validate(patientValidation.list), patientController.listPatient);
router.post('/create', validate(patientValidation.create), patientController.createPatient);
router.get('/detail/:id', validate(patientValidation.detailPatient), patientController.getDetailPatient);

// -------------------------------- ADMIN ROUTE ------------------------------------
router.get(
  '/list-for-staff',
  staffPermission(ALL_STAFF_ROLES),
  validate(patientValidation.listForStaff),
  patientController.listPatientForStaff
);

router.get(
  '/detail-for-staff/:id',
  staffPermission(ALL_STAFF_ROLES),
  validate(patientValidation.detailPatient),
  patientController.getDetailPatientForStaff
);

router.post(
  '/edit/:id',
  validate(patientValidation.editPatient),
  staffPermission(ALL_STAFF_ROLES),
  patientController.editPatient
);
router.post('/create-for-staff', validate(patientValidation.create), patientController.createPatientForStaff);

module.exports = router;
