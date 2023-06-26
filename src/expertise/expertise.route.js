const express = require('express');
const expertiseController = require('./expertise.controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const expertiseValidation = require('./expertise.validation');
const { staffPermission } = require('../middlewares/staffPermission');
const { STAFF_ROLES } = require('../staff/staff.constant');

const router = express.Router();

router.get('/list', expertiseController.getAll);

router.post(
  '/create-expertise',
  auth(),
  staffPermission([STAFF_ROLES.ADMIN]),
  validate(expertiseValidation.createExpertise),
  expertiseController.createExpertise
);

router.post(
  '/update-expertise',
  auth(),
  staffPermission([STAFF_ROLES.ADMIN]),
  validate(expertiseValidation.updateExpertise),
  expertiseController.updateExpertise
);

router.delete(
  '/delete-expertise',
  auth(),
  staffPermission([STAFF_ROLES.ADMIN]),
  validate(expertiseValidation.deleteExpertise),
  expertiseController.deleteExpertise
);

module.exports = router;
