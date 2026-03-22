import Redis from "ioredis";

const redisUrl = `rediss://default:${process.env.REDIS_SECRET}@${process.env.REDIS_URL}:15551`;

export const redis = new Redis(redisUrl);