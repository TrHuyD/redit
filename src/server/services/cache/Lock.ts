import { redis } from "@/server/lib/redis";

export type LockResult<T> =
  | { status: "acquired"; data: T }
  | { status: "skipped" }
  | { status: "error"; message: string };

export interface LockOptions {
  key: string;
  ttlMs?: number;
  retryDelayMs?: number;
  maxRetries?: number;
}

export interface LockHandle {
  release: () => Promise<void>;
  token: string;
  key: string;
}

export class LockAcquisitionError extends Error {
  constructor(key: string) {
    super(`Failed to acquire lock: ${key}`);
    this.name = "LockAcquisitionError";
  }
}

const DEFAULTS = { ttlMs: 5_000, retryDelayMs: 500, maxRetries: 2 } as const;

const RELEASE_SCRIPT = `
  if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
  else
    return 0
  end
`;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const jitter = (max: number) => Math.floor(Math.random() * max);
const lockKey = (key: string) => `lock:${key}`;

export async function tryAcquire(opts: LockOptions): Promise<LockHandle | null> {
  const { key, ttlMs = DEFAULTS.ttlMs } = opts;
  const token = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const k = lockKey(key);

  if ((await redis.set(k, token, "PX", ttlMs, "NX")) !== "OK") return null;

  let released = false;
  return {
    token,
    key: k,
    release: async () => {
      if (released) return;
      released = true;
      redis.eval(RELEASE_SCRIPT, 1, k, token).catch(console.error);
    },
  };
}

export async function acquireLock(opts: LockOptions): Promise<LockHandle> {
  const { retryDelayMs = DEFAULTS.retryDelayMs, maxRetries = DEFAULTS.maxRetries } = opts;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const handle = await tryAcquire(opts);
    if (handle) return handle;
    if (attempt < maxRetries) await sleep(retryDelayMs + jitter(retryDelayMs));
  }

  throw new LockAcquisitionError(opts.key);
}

async function runWithHandle<T>(handle: LockHandle, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } finally {
    await handle.release();
  }
}

export async function withLock<T>(opts: LockOptions, fn: () => Promise<T>): Promise<T> {
  return runWithHandle(await acquireLock(opts), fn);
}

export async function withLockOrSkip<T>(
  opts: LockOptions,
  fn: () => Promise<T>
): Promise<LockResult<T>> {
  const handle = await tryAcquire(opts);
  if (!handle) return { status: "skipped" };
  const data = await runWithHandle(handle, fn);
  return { status: "acquired", data };
}

export async function withLockOrFallback<T>(
  opts: LockOptions,
  fn: () => Promise<T>,
  fallback: () => Promise<T> | T
): Promise<T> {
  const handle = await tryAcquire(opts);
  return handle ? runWithHandle(handle, fn) : fallback();
}

export async function withLockOrTimeout<T>(
  opts: LockOptions,
  fn: () => Promise<T>,
  timeoutMs: number
): Promise<T> {
  const retryDelayMs = opts.retryDelayMs ?? DEFAULTS.retryDelayMs;
  const deadline = Date.now() + timeoutMs;

  while (true) {
    const handle = await tryAcquire(opts);
    if (handle) return runWithHandle(handle, fn);
    if (Date.now() + retryDelayMs >= deadline) {
      throw new LockAcquisitionError(`${opts.key} (timed out after ${timeoutMs}ms)`);
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
    return withLock(opts, async () => (await resultStore.get(resultKey)) ?? fn());
  }

  return runWithHandle(handle, async () => {
    const result = await fn();
    await resultStore.set(resultKey, result);
    return result;
  });
}