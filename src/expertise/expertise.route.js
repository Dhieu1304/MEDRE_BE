const express = require('express');
const expertiseController = require('./expertise.controller');

const router = express.Router();

router.get('/list', expertiseController.listExpertise);

module.exports = router;
