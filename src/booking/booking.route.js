const express = require('express');
const bookingController = require('./booking.controller');
const validate = require('../middlewares/validate');
const bookingValidation = require('./booking.validation');
const auth = require('../middlewares/auth');
//const { staffPermission } = require('../middlewares/staffPermission');
//const { ALL_STAFF_ROLES } = require('../staff/staff.constant');

const router = express.Router();

router.get('/list', auth(), bookingController.listBookings);
router.post(
  '/new-booking',
  auth(),
  validate(bookingValidation.booking), 
  bookingController.booking);

// -------------------------------- ADMIN ROUTE ------------------------------------

router.get('/details/:id', auth(), bookingController.getDetailBooking);
router.post(
  '/change-booking-status',
  auth(),
  validate(bookingValidation.updateBookingStatus),
  bookingController.updateBookingStatus
);
router.post(
  '/cancel',
  auth(),
  validate(bookingValidation.cancelBooking), 
  bookingController.cancelBooking);


module.exports = router;
