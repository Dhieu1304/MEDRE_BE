const express = require('express');
const globalSettingController = require('./global_setting.controller');
const globalSettingValidation = require('./global_setting.validation');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const { staffPermission } = require('../middlewares/staffPermission');
const { STAFF_ROLES } = require('../staff/staff.constant');

const router = express.Router();
router.use(auth());

router.get('/list', globalSettingController.getSetting);
router.post(
  '/edit',
  staffPermission([STAFF_ROLES.ADMIN]),
  validate(globalSettingValidation.editSetting),
  globalSettingController.editSetting
);

module.exports = router;
