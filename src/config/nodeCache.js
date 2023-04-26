const NodeCache = require('node-cache');
const nodeCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

module.exports = nodeCache;
module.exports.nodeCache = nodeCache;
module.exports.default = nodeCache;
