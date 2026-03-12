const redis = require('redis');

let redisClient = null;

const connectRedis = async () => {
  try {
    if (!process.env.REDIS_URL) {
      console.log('Redis URL not configured, skipping Redis connection');
      return null;
    }

    redisClient = redis.createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on('error', (err) => {
      console.log('Redis Client Error', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis Connected');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.log('Redis connection failed, continuing without cache:', error.message);
    return null;
  }
};

const getRedisClient = () => redisClient;

module.exports = { connectRedis, getRedisClient };
