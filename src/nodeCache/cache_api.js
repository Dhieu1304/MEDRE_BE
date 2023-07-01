const nodeCache = require('../config/nodeCache');
const _ = require('lodash');
const { sortObject } = require('../utils/sortObject');

const convertFilter = (page, limit, filter) => {
  let filterTemp = _.clone(filter);
  if (page) {
    filterTemp.page = page;
  }
  if (limit) {
    filterTemp.limit = limit;
  }
  return sortObject(filterTemp);
};

const setList = (page, limit, filter, pattern, value, ttlInSecond) => {
  const filterTemp = convertFilter(page, limit, filter);
  nodeCache.set(`${pattern}_${JSON.stringify(filterTemp)}`, JSON.stringify(value), ttlInSecond);
};

const getList = (page, limit, filter, pattern) => {
  const filterTemp = convertFilter(page, limit, filter);
  const result = nodeCache.get(`${pattern}_${JSON.stringify(filterTemp)}`);
  if (result) {
    return JSON.parse(result);
  }
  return false;
};

const delList = (page, limit, filter, pattern) => {
  const filterTemp = convertFilter(page, limit, filter);
  nodeCache.del(`${pattern}_${JSON.stringify(filterTemp)}`);
};

const delPattern = (pattern) => {
  const keys = nodeCache.keys();
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].startsWith(pattern)) {
      nodeCache.del(keys[i]);
    }
  }
};

module.exports = {
  setList,
  getList,
  delList,
  delPattern,
};
