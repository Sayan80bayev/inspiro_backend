const Redis = require('ioredis');

const redis = new Redis({
  host: 'redis', // service name from docker-compose
  port: 6379,
  maxRetriesPerRequest: 1,
});

const DEFAULT_EXPIRATION = 60; // 60 seconds

const cache = {
  async get(key) {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  },

  async set(key, value, expiration = DEFAULT_EXPIRATION) {
    await redis.setex(key, expiration, JSON.stringify(value));
  },

  async del(key) {
    await redis.del(key);
  },
};

module.exports = cache;
