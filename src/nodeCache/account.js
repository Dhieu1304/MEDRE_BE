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

module.exports = {
  blockAccount,
  isBlockedAccount,
  unBlockAccount,
};
