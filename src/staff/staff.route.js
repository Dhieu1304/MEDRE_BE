const express = require('express');
//const auth = require('../middlewares/auth');
// const validate = require('../middlewares/validate');
// const userValidation = require('./user.validation');
const staffController = require('./staff.controller');

const router = express.Router();

router.get('/info/:id', staffController.getInfo);
router.get('/all', staffController.getAll);
router.get('/doctors', staffController.getAllDoctor);

module.exports = router;
