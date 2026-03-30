import { redis } from "@/server/lib/redis";

export type LockResult<T> =
  | { status: "acquired"; data: T }
  | { status: "skipped" }
  | { status: "error"; message: string };

export interface LockOptions {
  ttlMs?: number;
  retryDelayMs?: number;
  maxRetries?: number;
  key: string;
}

const DEFAULTS = {
  ttlMs: 5_000,
  retryDelayMs: 500,
  maxRetries: 2,
} as const;

export interface LockHandle {
  release: () => Promise<void>;
  token: string;
  key: string;
}


const RELEASE_SCRIPT = `
  if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
  else
    return 0
  end
`;


export class LockAcquisitionError extends Error {
  constructor(key: string) {
    super(`Failed to acquire lock: ${key}`);
    this.name = "LockAcquisitionError";
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const jitter = (max: number) => Math.floor(Math.random() * max);
const lockKey = (key: string) => `lock:${key}`;


export async function tryAcquire(
  opts: LockOptions
): Promise<LockHandle | null> {
  const { key, ttlMs = DEFAULTS.ttlMs } = opts;
  const token = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const k = lockKey(key);
  const acquired = await redis.set(k, token, "PX", ttlMs, "NX");
  if (acquired !== "OK") return null;
  let released = false;
  const release = async () => {
    if (released) return;
    released = true;
    await redis.eval(RELEASE_SCRIPT, 1, k, token);
  };
  return {token, key: k,release,};
}

export async function acquireLock(opts: LockOptions): Promise<LockHandle> {
  const {
    retryDelayMs = DEFAULTS.retryDelayMs,
    maxRetries = DEFAULTS.maxRetries,} = opts;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const handle = await tryAcquire(opts);
    if (handle) return handle;
    if (attempt < maxRetries) {
      await sleep(retryDelayMs + jitter(retryDelayMs));
    }
  }
  throw new LockAcquisitionError(opts.key);
}

export async function withLock<T>(
  opts: LockOptions,
  fn: () => Promise<T>
): Promise<T> {
  const handle = await acquireLock(opts);
  try {
    return await fn();
  } finally {
    await handle.release();
  }
}

export async function withLockOrSkip<T>(
  opts: LockOptions,
  fn: () => Promise<T>
): Promise<LockResult<T>> {
  const handle = await tryAcquire(opts);

  if (!handle) return { status: "skipped" };

  try {
    const data = await fn();
    return { status: "acquired", data };
  } finally {
    await handle.release();
  }
}

export async function withLockOrFallback<T>(
  opts: LockOptions,
  fn: () => Promise<T>,
  fallback: () => Promise<T> | T
): Promise<T> {
  const handle = await tryAcquire(opts);

  if (!handle) return fallback();

  try {
    return await fn();
  } finally {
    await handle.release();
  }
}

export async function withLockOrTimeout<T>(
  opts: LockOptions,
  fn: () => Promise<T>,
  timeoutMs: number
): Promise<T> {
  const deadline = Date.now() + timeoutMs;
  const retryDelayMs = opts.retryDelayMs ?? DEFAULTS.retryDelayMs;

  while (true) {
    const handle = await tryAcquire(opts);

    if (handle) {
      try {
        return await fn();
      } finally {
        await handle.release();
      }
    }
    if (Date.now() + retryDelayMs >= deadline) {
      throw new LockAcquisitionError(
        `${opts.key} (timed out after ${timeoutMs}ms)`
      );
    }
    await sleep(retryDelayMs + jitter(retryDelayMs));
  }
}

export async function withLockCoalesce<T>(
  opts: LockOptions,
  fn: () => Promise<T>,
  resultStore: {
    get: (key: string) => Promise<T | null>;
    set: (key: string, value: T) => Promise<void>;
  }
): Promise<T> {
  const resultKey = `result:${opts.key}`;
  const cached = await resultStore.get(resultKey);
  if (cached !== null) return cached;
  const handle = await tryAcquire(opts);
  if (!handle) {
    return withLock(opts, async () => {
      const result = await resultStore.get(resultKey);
      if (result !== null) return result;
      return fn();
    });
  }
  try {
    const result = await fn();
    await resultStore.set(resultKey, result);
    return result;
  } finally {
    await handle.release();
  }
}
