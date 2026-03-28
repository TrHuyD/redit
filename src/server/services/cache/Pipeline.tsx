import { redis } from "@/server/lib/redis"
import {BatchContext,cacheRead,cacheReadHash,cacheWriteAndUnlock,cacheWriteHashAndUnlock,lockStrategy,mergeResult,runBatch,waitForCache,} from "./Strategy"
export function createCachedBatchLoader2<K extends string | number | bigint, V>(options: {
  keyFn: (k: K) => string
  fetch: (keys: K[]) => Promise<V[]>
  map: (v: V) => K
  ttl: number
  nullTtl: number
}): (keys: K[]) => Promise<(V | null)[]> {
  return createCachedBatchLoader<K, V, V>({
    ...options,
    select: (v) => v,
  })
}

export function createCachedBatchLoader<K extends string | number | bigint, Raw, Cached = Raw>(options: {
  keyFn: (k: K) => string
  fetch: (keys: K[]) => Promise<Raw[]>
  map: (v: Raw) => K
  select: (v: Raw | null) => Cached | null
  ttl: number
  nullTtl: number
}): (keys: K[]) => Promise<(Cached | null)[]> {
  return async function load(keys: K[]): Promise<(Cached | null)[]> {
    if (!keys.length) return [] 
    const ctx: BatchContext<K, Cached> = {
      keys,
      cached: new Map(),
      missing: new Set(),
      fetched: new Map(),
      result: new Map(),
    }

    return runBatch(ctx, [
      cacheRead(options.keyFn),
      lockStrategy(options.keyFn),
      waitForCache(options.keyFn),

      async (ctx) => {
        if (ctx.missing.size === 0) return

        const missingKeys = Array.from(ctx.missing)
        const raw = await options.fetch(missingKeys)
        const rawMap = new Map<string, Raw>()
        for (const item of raw) {
          rawMap.set(options.map(item).toString(), item)
        }
        
        for (const k of missingKeys) {
          const rawVal = rawMap.get(k.toString()) ?? null
          const finalVal = options.select(rawVal)
          ctx.fetched.set(k, finalVal)
        }
      },

      cacheWriteAndUnlock(options.keyFn, options.ttl, options.nullTtl),
      mergeResult(),
    ])
  }
}
export async function incrHashField(
  keys: string[],
  field: string,
  delta: number,
  ttl?:number
): Promise<void> {
  if (keys.length === 0) return
  const pipeline = redis.multi()
  for (const key of keys) {
      pipeline.hincrby(key, field, delta)
      if(ttl) pipeline.expire(key,ttl)
  }
  await pipeline.exec()
}

export function createCachedHashLoader2<K extends string | number | bigint, V extends Record<string, any>>(options: {
  keyFn: (k: K) => string
  fetch: (keys: K[]) => Promise<V[]>
  map: (v: V) => K
  ttl: number
  nullTtl: number
}): (keys: K[]) => Promise<(V | null)[]> {
  return createCachedHashLoader<K, V, V>({
    ...options,
    select: (v) => v,
  })
}

export function createCachedHashLoader
  <K extends string | number | bigint,
  Raw extends Record<string, any>,
  Cached extends Record<string, any> = Raw
>(options: {
  keyFn: (k: K) => string
  fetch: (keys: K[]) => Promise<Raw[]>
  map: (v: Raw) => K
  select: (v: Raw | null) => Cached | null
  ttl: number
  nullTtl: number
}): (keys: K[]) => Promise<(Cached | null)[]> {

  return async function load(keys: K[]): Promise<(Cached | null)[]> {
    if (!keys.length) return [] 
    const ctx: BatchContext<K, Cached> = {
      keys,
      cached: new Map(),
      missing: new Set(),
      fetched: new Map(),
      result: new Map(),
    }
    return runBatch(ctx, [
      cacheReadHash(options.keyFn),
      lockStrategy(options.keyFn),
      waitForCache(options.keyFn),
      async (ctx) => {
        if (ctx.missing.size === 0) return
        const missingKeys = Array.from(ctx.missing)
        const raw = await options.fetch(missingKeys)
        const rawMap = new Map<string, Raw>()
        for (const item of raw) {
          rawMap.set(options.keyFn(options.map(item)), item)  // bigint-safe
        }
        for (const k of missingKeys) {
          const rawVal = rawMap.get(options.keyFn(k)) ?? null  // bigint-safe
          const finalVal = options.select(rawVal)
          ctx.fetched.set(k, finalVal)
        }
      },
       cacheWriteHashAndUnlock(options.keyFn, options.ttl, options.nullTtl),
      mergeResult(),
    ])
  }
}

export async function pushBigInt(key: string,value: bigint,maxSize: number): Promise<void> {
  const val = value.toString()
  const pipeline = redis.pipeline()
  pipeline.lpush(key, val)
  pipeline.ltrim(key, 0, maxSize - 1)
  await pipeline.exec()
}

export async function getBigInts(key: string,size: number): Promise<bigint[]> {
  const res = await redis.lrange(key, 0, size - 1)
  return res.map(v => BigInt(v))
}

export async function pushSortedUnique(key: string, value: bigint, maxSize: number): Promise<void> {
  const pipeline = redis.pipeline()
  pipeline.zadd(key,  Date.now(), value.toString())
  pipeline.zremrangebyrank(key, 0, -(maxSize + 1))
  await pipeline.exec()
}

export async function getSortedUnique(key: string, size: number): Promise<bigint[]> {
  const res = await redis.zrevrange(key, 0, size - 1)
  return res.map(v => BigInt(v))
}