const express = require('express');
const historyBookingController = require('./history_booking.controller');
const validate = require('../middlewares/validate');
const historyBookingValidation = require('./history_booking.validation');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get(
    '/list', 
    auth(), 
    historyBookingController.listHistoryBookings);

router.get(
    '/', 
    auth(), 
    validate(historyBookingValidation.historyBooking), 
    historyBookingController.historyBooking);

// -------------------------------- ADMIN ROUTE ------------------------------------

router.get(
    '/details/:id', 
    auth(), 
    historyBookingController.getDetailBooking);

module.exports = router;
