const express = require('express');
const validate = require('../middlewares/validate');
const checkupPackageController = require('./checkup_package.controller');
const checkupPackageValidation = require('./checkup_package.validation');
const auth = require('../middlewares/auth');

const router = express.Router();

module.exports = router;
