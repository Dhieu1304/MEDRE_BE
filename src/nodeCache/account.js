const nodeCache = require('../config/nodeCache');
const config = require('../config');

const blockAccount = (id) => {
  nodeCache.set(`block_${id}`, 1, config.jwt.accessExpirationMinutes * 60);
};

const isBlockedAccount = (id) => {
  return !!nodeCache.get(`block_${id}`);
};

const unBlockAccount = (id) => {
  nodeCache.del(`block_${id}`);
};

const delGoogleDataAfterLogin = (id) => {
  nodeCache.del(`user_${id}`);
};
const getGoogleDataAfterLogin = (id) => {
  return nodeCache.get(`user_${id}`);
};

const setGoogleDataAfterLogin = (id, data) => {
  nodeCache.set(`user_${id}`, JSON.stringify(data), 5 * 60);
};

module.exports = {
  blockAccount,
  isBlockedAccount,
  unBlockAccount,
  getGoogleDataAfterLogin,
  setGoogleDataAfterLogin,
  delGoogleDataAfterLogin,
};
