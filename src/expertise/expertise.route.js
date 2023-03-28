const express = require('express');
const expertiseController = require('./expertise.controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const expertiseValidation = require('./expertise.validation');

const router = express.Router();

router.get('/list', auth(), validate(expertiseValidation.getAllExpertise), expertiseController.getAll);

router.post('/create-expertise', auth(), validate(expertiseValidation.createExpertise), expertiseController.createExpertise);

router.post('/update-expertise', auth(), validate(expertiseValidation.updateExpertise), expertiseController.updateExpertise);

router.delete(
  '/delete-expertise',
  auth(),
  validate(expertiseValidation.createExpertise),
  expertiseController.deleteExpertise
);

module.exports = router;
