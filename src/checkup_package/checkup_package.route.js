const express = require('express');
const checkupPackageController = require('./checkup_package.controller');
const validate = require('../middlewares/validate');
const checkupPackageValidation = require('./checkup_package.validation');
const { staffPermission } = require('../middlewares/staffPermission');
const { ALL_STAFF_ROLES } = require('../staff/staff.constant');

const router = express.Router();

router.get(
  '/list-checkup-package',
  staffPermission(ALL_STAFF_ROLES),
  validate(checkupPackageValidation.listCheckupPackage),
  checkupPackageController.getAllCheckupPackage
);
router.get('/expertise/:id', checkupPackageController.getAllCheckupPackageByExpertise);
router.post(
  '/update-checkup-package/:id',
  staffPermission(ALL_STAFF_ROLES),
  validate(checkupPackageValidation.updateCheckupPackage),
  checkupPackageController.updateCheckupPackage
);
router.post(
  '/create-checkup-package',
  staffPermission(ALL_STAFF_ROLES),
  validate(checkupPackageValidation.createPackage),
  checkupPackageController.createCheckupPackage
);
router.post('/delete-checkup-package/:id', staffPermission(ALL_STAFF_ROLES), checkupPackageController.deleteCheckupPackage);

module.exports = router;
