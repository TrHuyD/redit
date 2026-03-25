import {BatchContext,cacheRead,cacheWriteAndUnlock,lockStrategy,mergeResult,runBatch,waitForCache,} from "./Strategy"
  export function createCachedBatchLoader<K, V>(options: {
    keyFn: (k: K) => string
    fetch: (keys: K[]) => Promise<V[]>
    map: (v: V) => K
    ttl: number
    nullTtl: number
  }): (keys: K[]) => Promise<(V | null)[]>
  export function createCachedBatchLoader<K, Raw, Cached>(options: {
    keyFn: (k: K) => string
    fetch: (keys: K[]) => Promise<Raw[]>
    map: (v: Raw) => K
    select: (v: Raw | null) => Cached | null
    ttl: number
    nullTtl: number
  }): (keys: K[]) => Promise<(Cached | null)[]>
  export function createCachedBatchLoader<K, Raw, Cached>(options: {
    keyFn: (k: K) => string
    fetch: (keys: K[]) => Promise<Raw[]>
    map: (v: Raw) => K
    select?: (v: Raw | null) => Cached | null
    ttl: number
    nullTtl: number
  }) {
    return async function load(keys: K[]): Promise<(any | null)[]> {
      const ctx: BatchContext<K, any> = {
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
  
          const keys = Array.from(ctx.missing)
          const raw = await options.fetch(keys)
  
          const rawMap = new Map<K, Raw>()
          for (const item of raw) {
            rawMap.set(options.map(item), item)
          }
  
          for (const k of keys) {
            const rawVal = rawMap.get(k) ?? null
  
            const finalVal = options.select
              ? options.select(rawVal)
              : rawVal
  
            ctx.fetched.set(k, finalVal)
          }
        },
  
        cacheWriteAndUnlock(
          options.keyFn,
          options.ttl,
          options.nullTtl
        ),
  
        mergeResult(),
      ])
    }
  }