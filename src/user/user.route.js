const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('./user.controller');
const validate = require('../middlewares/validate');
const userValidation = require('./user.validation');
const { staffPermission } = require('../middlewares/staffPermission');
const { ALL_STAFF_ROLES, STAFF_ROLES } = require('../staff/staff.constant');
const staffController = require('../staff/staff.controller');

const router = express.Router();
router.use(auth());

router.get(
  '/my-profile',
  userController.getInfo);

router.post(
  '/my-profile/edit',
  validate(userValidation.editUser),
  userController.editProfile);

  router.post(
    '/my-profile/change-password',
    validate(userValidation.changePassword),
    userController.changePassword);

// -------------------------------- ADMIN ROUTE ------------------------------------

router.get(
    '/list',
    staffPermission(ALL_STAFF_ROLES),
    validate(userValidation.listUser),
    userController.getAll);

router.get(
  '/detail/:id',
  staffPermission(ALL_STAFF_ROLES),
    validate(userValidation.detailUser),
  userController.getDetailUser);

router.post(
  '/edit/:id',
  validate(userValidation.editUser),
  staffPermission([STAFF_ROLES.ADMIN]),
  staffController.editAccountInfo
);

module.exports = router;
