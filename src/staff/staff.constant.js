const STAFF_ROLES = Object.freeze({
  ADMIN: 'Admin',
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  CUSTOMER_SERVICE: 'Customer_Service',
});

const ALL_STAFF_ROLES = Object.freeze([
  STAFF_ROLES.ADMIN,
  STAFF_ROLES.DOCTOR,
  STAFF_ROLES.NURSE,
  STAFF_ROLES.CUSTOMER_SERVICE,
]);

module.exports = {
  STAFF_ROLES,
  ALL_STAFF_ROLES,
};
