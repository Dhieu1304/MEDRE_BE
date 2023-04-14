const express = require('express');
const uploadController = require('./upload.controller');
const upload = require('../middlewares/multer');

const router = express.Router();

router.post('/avatar', upload.single('image'), uploadController.uploadAvatar);

module.exports = router;
