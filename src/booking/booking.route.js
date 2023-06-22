const express = require('express');
const bookingController = require('./booking.controller');
const validate = require('../middlewares/validate');
const bookingValidation = require('./booking.validation');
const auth = require('../middlewares/auth');
const { staffPermission } = require('../middlewares/staffPermission');
const { ALL_STAFF_ROLES, STAFF_ROLES } = require('../staff/staff.constant');

const router = express.Router();
router.use(auth());

router.get('/list', validate(bookingValidation.list), bookingController.listBookings);
router.get(
  '/schedule-booking-count',
  validate(bookingValidation.scheduleBookingTime),
  bookingController.scheduleBookingTimeCount
);
router.get(
  '/schedule-booking-count-many-staff',
  validate(bookingValidation.scheduleBookingTimeManyStaff),
  bookingController.scheduleBookingTimeCount
);
router.post('/new-booking', validate(bookingValidation.booking), bookingController.booking);
router.get('/detail/:id', validate(bookingValidation.detailBooking), bookingController.getDetailBooking);
router.post('/cancel', validate(bookingValidation.cancelBooking), bookingController.cancelBooking);

// -------------------------------- ADMIN ROUTE ------------------------------------

router.get(
  '/list-for-staff',
  staffPermission(ALL_STAFF_ROLES),
  validate(bookingValidation.listForStaff),
  bookingController.listBookingsForStaff
);
router.get(
  '/detail-for-staff/:id',
  staffPermission(ALL_STAFF_ROLES),
  validate(bookingValidation.detailBooking),
  bookingController.getDetailBookingForStaff
);
router.post(
  '/update',
  staffPermission(ALL_STAFF_ROLES),
  validate(bookingValidation.updateBooking),
  bookingController.updateBooking
);
router.post(
  '/update-for-doctor',
  staffPermission([STAFF_ROLES.DOCTOR, STAFF_ROLES.ADMIN]),
  validate(bookingValidation.updateBookingDoctor),
  bookingController.updateBookingDoctor
);
router.post(
  '/create-booking-for-staff',
  staffPermission(ALL_STAFF_ROLES),
  validate(bookingValidation.bookingForStaff),
  bookingController.staffCreateBooking
);

module.exports = router;
