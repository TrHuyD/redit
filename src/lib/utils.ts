
import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNowStrict } from 'date-fns'
import locale from 'date-fns/locale/en-US'
import { getAuthToken } from './auth'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const formatDistanceLocale = {
  lessThanXSeconds: 'just now',
  xSeconds: 'just now',
  halfAMinute: 'just now',
  lessThanXMinutes: '{{count}}m',
  xMinutes: '{{count}}m',
  aboutXHours: '{{count}}h',
  xHours: '{{count}}h',
  xDays: '{{count}}d',
  aboutXWeeks: '{{count}}w',
  xWeeks: '{{count}}w',
  aboutXMonths: '{{count}}m',
  xMonths: '{{count}}m',
  aboutXYears: '{{count}}y',
  xYears: '{{count}}y',
  overXYears: '{{count}}y',
  almostXYears: '{{count}}y',
}

function formatDistance(token: string, count: number, options?: any): string {
  options = options || {}

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace('{{count}}', count.toString())

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return 'in ' + result
    } else {
      if (result === 'just now') return result
      return result + ' ago'
    }
  }

  return result
}

export function formatTimeToNow(date: Date): string
export function formatTimeToNow(date: bigint): string

export function formatTimeToNow(date: Date | bigint): string {
  const normalizedDate =
    typeof date === "bigint"
      ? new Date(Number(date)) 
      : date
  return formatDistanceToNowStrict(normalizedDate, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  })
}
export function getId<T extends { id: string }>(obj: T): bigint {
  return BigInt(obj.id);
}
export function getIdnull<T extends { id: string }>(obj: T | null | undefined): bigint | undefined {
  if (!obj) return undefined
  return BigInt(obj.id)
}

export function createSingleLoader<K, V>(
  batchLoader: (keys: K[]) => Promise<(V | null)[]>
) {
  return async (key: K): Promise<V | null> => {
    const result = await batchLoader([key])
    return result[0] ?? null
  }
}

export const filterNull = <T>(arr: (T | null | undefined)[]): T[] => 
  arr.filter((x): x is T => x != null)

export function toMap<V>(items: (V | null | undefined)[], key: (v: V) => string): Map<string, V> {
  const map = new Map<string, V>()
  for (const item of items) {
      if (item != null)
          map.set(key(item), item)
  }
  return map
}
export function zipToMap<K extends string | bigint, V>(keys: K[], values: (V | null | undefined)[]): Map<string, V> {
  const map = new Map<string, V>()
  for (let i = 0; i < keys.length; i++) {
      const v = values[i]
      if (v != null)
          map.set(keys[i].toString(), v)
  }
  return map
}