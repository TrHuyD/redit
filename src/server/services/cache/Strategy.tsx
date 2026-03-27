import {redis} from '@/server/lib/redis'
export type BatchContext<K, V> = {
    keys: K[]
    cached: Map<K, V | null>
    missing: Set<K>
    fetched: Map<K, V | null>
    result: Map<K, V | null>
  }
export type Strategy<K, V> = (ctx: BatchContext<K, V>) => Promise<void>


export async function runBatch<K, V>(
    ctx: BatchContext<K, V>,
    strategies: Strategy<K, V>[]
  ): Promise<(V | null)[]> {
    for (const strat of strategies) {
      await strat(ctx)
    }
  
    return ctx.keys.map(k => ctx.result.get(k) ?? null)
} 


export function cacheRead<K, V>(
    keyFn: (k: K) => string
  ): Strategy<K, V> {
    return async (ctx) => {
      const redisKeys = ctx.keys.map(keyFn)
      const values = await redis.mget(redisKeys)
  
      values.forEach((val: string | null, i: number) => {
        const k = ctx.keys[i]
  
        if (val !== null) {
          ctx.cached.set(k, JSON.parse(val))
        } else {
          ctx.missing.add(k)
        }
      })
    }
  }

export  function fetchMany<K, V>(
    getFreshMany: (keys: K[]) => Promise<V[]>,
    mapResult: (v: V) => K
  ): Strategy<K, V> {
    return async (ctx) => {
      if (ctx.missing.size === 0) return
  
      const keys = Array.from(ctx.missing)
      const fresh = await getFreshMany(keys)
  
      const freshMap = new Map<K, V>()
      for (const item of fresh) {
        freshMap.set(mapResult(item), item)
      }
  
      for (const k of keys) {
        ctx.fetched.set(k, freshMap.get(k) ?? null)
      }
    }
  }


  export function lockStrategy<K, V>(
    keyFn: (k: K) => string,
    lockTTL = 3000
  ): Strategy<K, V> {
  
    return async (ctx) => {
      if (ctx.missing.size === 0) return
  
      const keys = Array.from(ctx.missing)
  
      const pipeline = redis.multi()
      for (const k of keys) {
        const lockKey = `lock:${keyFn(k)}`
        pipeline.set(lockKey, "1", "PX", lockTTL, "NX")
      }
      const results = await pipeline.exec()
      const lockedByMe = new Set<K>()
      const stillMissing = new Set<K>()
      results?.forEach((res: any, i: number) => {
        const k = keys[i]
        const result = Array.isArray(res) ? res[1] : res
        if (result === "OK") {
          lockedByMe.add(k)
        } else {
          stillMissing.add(k)
        }
      })
      ctx.missing = lockedByMe
      ;(ctx as any).waiting = stillMissing
    }
  }
export function waitForCache<K, V>(
    keyFn: (k: K) => string,
    options?: {
      retries?: number
      initialDelay?: number
    }
  ): Strategy<K, V> {
    const retries = options?.retries ?? 5
    const initialDelay = options?.initialDelay ?? 20
  
    return async (ctx) => {
      const waiting: Set<K> = (ctx as any).waiting
      if (!waiting || waiting.size === 0) return
  
      let delay = initialDelay
  
      const stillMissing = new Set<K>()
  
      for (let i = 0; i < retries; i++) {
        await sleep(delay)
  
        const keys = Array.from(waiting)
        const redisKeys = keys.map(keyFn)
  
        const values = await redis.mget(redisKeys)
  
        let allResolved = true
  
        values.forEach((val: string | null, i: number) => {
          const k = keys[i]
  
          if (val !== null) {
            ctx.cached.set(k, JSON.parse(val))
          } else {
            allResolved = false
            stillMissing.add(k)
          }
        })
  
        if (allResolved) {
          return
        }
  
        delay *= 2
      }
  
      for (const k of stillMissing) {
        ctx.missing.add(k)
      }
    }
  }
  
  function sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms))
  }
export function cacheWriteAndUnlock<K, V>(
    keyFn: (k: K) => string,
    ttl: number,
    nullTtl: number
  ): Strategy<K, V> {
    return async (ctx) => {

      if (ctx.fetched.size === 0) return
      const pipeline = redis.multi()
      for (const [k, v] of ctx.fetched) {
        const cacheKey = keyFn(k)
        const lockKey = `lock:${cacheKey}`
        const finalTtl = v === null ? nullTtl : ttl
        const jitter = Math.floor(Math.random() * 10)
        pipeline.set(
          cacheKey,
          JSON.stringify(v),
          "EX",
          finalTtl + jitter
        )
        pipeline.del(lockKey)
      }
      await pipeline.exec()
    }
}
export function mergeResult<K, V>(): Strategy<K, V> {
    return async (ctx) => {

      for (const k of ctx.keys) {
        if (ctx.cached.has(k)) {
          ctx.result.set(k, ctx.cached.get(k)!);
        } else if (ctx.fetched.has(k)) {
          ctx.result.set(k, ctx.fetched.get(k)!);
        } else {
          ctx.result.set(k, null);
        }
      }
    };
  }

export function hincrbyStrategy<K>(
    keyFn: (k: K) => string,
    field: string,
    delta: number
): Strategy<K, never> {
    return async (ctx) => {
        const pipeline = redis.multi()
        for (const k of ctx.keys) {
            pipeline.hincrby(keyFn(k), field, delta)
        }
        await pipeline.exec()
    }
}

export function cacheReadHash<K, V>(
  keyFn: (k: K) => string
): Strategy<K, V> {
  return async (ctx) => {
      const pipeline = redis.multi()
      for (const k of ctx.keys) {
          pipeline.hgetall(keyFn(k))
      }
      const results = await pipeline.exec()

      results?.forEach((res: any, i: number) => {
          const k = ctx.keys[i]
          const val = Array.isArray(res) ? res[1] : res

          if (val && Object.keys(val).length > 0) {
              ctx.cached.set(k, val as V)
          } else {
              ctx.missing.add(k)
          }
      })
  }
}

export function cacheWriteHashAndUnlock<K, V extends Record<string, any>>(
  keyFn: (k: K) => string,
  ttl: number,
  nullTtl: number
): Strategy<K, V> {
  return async (ctx) => {
      if (ctx.fetched.size === 0) return

      const pipeline = redis.multi()
      for (const [k, v] of ctx.fetched) {
          const cacheKey = keyFn(k)
          const lockKey = `lock:${cacheKey}`
          const finalTtl = v === null ? nullTtl : ttl
          const jitter = Math.floor(Math.random() * 10)

          if (v === null) {
              pipeline.hset(cacheKey, { __null__: "1" })
          } else {
              pipeline.hset(cacheKey, v)
          }
          pipeline.expire(cacheKey, finalTtl + jitter)
          pipeline.del(lockKey)
      }
      await pipeline.exec()
  }
}