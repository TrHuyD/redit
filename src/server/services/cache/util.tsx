import { redis } from "@/server/lib/redis";

export async function incrCache(key: string, delta: number) {
  if (delta === 0) return;
  await redis.incrby(key, delta);
}