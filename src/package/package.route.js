const express = require('express');
const validate = require('../middlewares/validate');
const packageController = require('./package.controller');
const packageValidation = require('./package.validation');
const auth = require('../middlewares/auth');

const router = express.Router();

module.exports = router;
