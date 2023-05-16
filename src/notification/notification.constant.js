const NOTIFICATION_TYPE = Object.freeze({
  BOOKING: 'Booking',
  EVENT: 'Event',
  ADVERTISEMENT: 'Advertisement',
});

const NOTIFICATION_FOR = Object.freeze({
  ALL_SYSTEM: 'AllSystem',
  PERSONAL: 'Personal',
  USER: 'User',
  STAFF: 'Staff',
  ADMIN: 'Admin',
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  CUSTOMER_SERVICE: 'Customer_Service',
});

module.exports = {
  NOTIFICATION_TYPE,
  NOTIFICATION_FOR,
};
