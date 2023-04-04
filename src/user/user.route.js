const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('./user.controller');
const validate = require('../middlewares/validate');
const userValidation = require('./user.validation');
const { staffPermission } = require('../middlewares/staffPermission');
const { ALL_STAFF_ROLES, STAFF_ROLES } = require('../staff/staff.constant');
const staffController = require('../staff/staff.controller');
const { editUser } = require('./user.service');

const router = express.Router();

router.get(
  '/list', 
  //auth(),
  userController.getAll);

router.get(
  '/my-profile', 
  auth(), 
  userController.getInfo);

router.post(
  '/my-profile/edit', 
  auth(),
  validate(userValidation.editUser),
  userController.editProfile);

  router.post(
    '/my-profile/change-password', 
    auth(),
    validate(userValidation.changePassword),
    userController.changePassword);

// -------------------------------- ADMIN ROUTE ------------------------------------
router.get(
  '/detail/:id', 
  auth(), 
  staffPermission(ALL_STAFF_ROLES), 
  userController.getDetailUser);

router.post(
  '/edit/:id',
  auth(),
  validate(userValidation.editUser),
  staffPermission([STAFF_ROLES.ADMIN]),
  staffController.editAccountInfo
);

module.exports = router;
