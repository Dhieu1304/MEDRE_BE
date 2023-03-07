const STAFF_ROLES = Object.freeze({
  ADMIN: 'Admin',
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
});

const ALL_STAFF_ROLES = Object.freeze([STAFF_ROLES.ADMIN, STAFF_ROLES.DOCTOR, STAFF_ROLES.NURSE]);

module.exports = {
  STAFF_ROLES,
  ALL_STAFF_ROLES,
};
