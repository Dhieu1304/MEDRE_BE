const ROLES = Object.freeze({
  ADMIN: 'Admin',
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  STAFF: 'Staff',
  USER: 'User',
});

const GENDERS = Object.freeze({
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other',
});

const USER_STATUS = Object.freeze({
  OK: 'Ok',
  BLOCK: 'Block',
});

module.exports = {
  ROLES,
  GENDERS,
  USER_STATUS,
};
