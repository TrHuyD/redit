import {BatchContext,cacheRead,cacheWriteAndUnlock,lockStrategy,mergeResult,runBatch,waitForCache,} from "./Strategy"
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