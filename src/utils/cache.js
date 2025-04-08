// utils/cache.js
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 }); // TTL = 60 seconds

module.exports = cache;
