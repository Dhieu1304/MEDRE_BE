const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('./user.controller');
const { staffPermission } = require('../middlewares/staffPermission');
const { ALL_STAFF_ROLES } = require('../staff/staff.constant');

const router = express.Router();

router.get('/info', auth(), userController.getInfo);

// staff permission to call
router.get('/detail/:id', auth(), staffPermission(ALL_STAFF_ROLES), userController.getDetailUser);

module.exports = router;
