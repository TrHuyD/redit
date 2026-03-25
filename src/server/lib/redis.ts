import Redis from "ioredis";

export const redis = new Redis({
    host: process.env.REDIS_URL,
    port: 15551,
    username: "default",
    password: process.env.REDIS_SECRET,
  })

