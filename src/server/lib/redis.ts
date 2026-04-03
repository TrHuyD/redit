import Redis from "ioredis"
import "@/lib/bigint";
declare global {
  var _redis: Redis | undefined
  interface BigInt {
    toJSON(): string;
  }
}
function createRedisInstance(){
  if(process.env.REDIS_TYPE=="UPSTASH")
    return new Redis(process.env.REDIS_UPSTASH!)
  return  new Redis({
    host: process.env.REDIS_URL,
    port: 15551,
    username: "default",
    password: process.env.REDIS_SECRET,
    maxRetriesPerRequest: 2,
    enableReadyCheck: true,
  })



}

export const redis =
  global._redis ??createRedisInstance()
if (process.env.NODE_ENV !== "production") {
  global._redis = redis
}