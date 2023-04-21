const TOKEN_TYPES = Object.freeze({
  ACCESS: 'Access',
  REFRESH: 'Refresh',
  VERIFY: 'Verify',
});

const ACCOUNT_TYPES = Object.freeze({
  USER: 1,
  STAFF: 2,
});

module.exports = {
  TOKEN_TYPES,
  ACCOUNT_TYPES,
};
