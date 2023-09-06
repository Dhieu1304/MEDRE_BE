const express = require('express');
const moreController = require('./more.controller');

const router = express.Router();

// queue
router.get('/queue', moreController.queueJob);

module.exports = router;
