import Redis from "ioredis"
import "@/lib/bigint";
declare global {
  var _redis: Redis | undefined
  interface BigInt {
    toJSON(): string;
  }
}

export const redis =
  global._redis ??
  new Redis({
    host: process.env.REDIS_URL,
    port: 15551,
    username: "default",
    password: process.env.REDIS_SECRET,
    maxRetriesPerRequest: 2,
    enableReadyCheck: true,
  })

if (process.env.NODE_ENV !== "production") {
  global._redis = redis
}