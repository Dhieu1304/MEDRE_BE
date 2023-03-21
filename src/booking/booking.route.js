const express = require('express');
const bookingController = require('./booking.controller');
const validate = require('../middlewares/validate');
const bookingValidation = require('./booking.validation');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth(), bookingController.listBookings);
router.post('/new-booking', auth(), validate(bookingValidation.booking), bookingController.booking);
router.get('/history-booking', auth(), validate(bookingValidation.historyBooking), bookingController.historyBooking);

// -------------------------------- ADMIN ROUTE ------------------------------------

router.get('/details/:id', auth(), bookingController.getDetailBooking);
router.get(
  '/change-booking-status',
  auth(),
  validate(bookingValidation.updateBookingStatus),
  bookingController.updateBookingStatus
);

module.exports = router;
