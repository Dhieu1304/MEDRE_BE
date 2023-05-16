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

const ID_SYSTEM = 'a12bc102-bab0-409e-9290-28320bea22ee';

module.exports = {
  STAFF_ROLES,
  ALL_STAFF_ROLES,
  ID_SYSTEM,
};
