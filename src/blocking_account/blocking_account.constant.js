const ACCOUNT_ROLES = Object.freeze({
  ADMIN: 'Admin',
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  CUSTOMER_SERVICE: 'Customer_Service',
  USER: 'User',
});

const BLOCK_ACCOUNT_TYPE = Object.freeze({
  BLOCK: 'Block',
  UNBLOCK: 'Unblock',
});

module.exports = {
  ACCOUNT_ROLES,
  BLOCK_ACCOUNT_TYPE,
};
