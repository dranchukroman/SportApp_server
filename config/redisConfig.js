import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

redis.on('ready', () => {
 console.log('Redis is ready to use');
});

export default redis;