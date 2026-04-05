
import {  createCachedBatchLoader2, createCachedHashLoader } from "../../cache/Pipeline"

import * as db from "./repo";
import { CachedPost, PostStat, PostStatMapped } from "@/types/post";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { createSingleLoader } from "@/lib/utils";
import { rediskey } from "@/types/rediskey";
import { redis } from "@/server/lib/redis";


export const getPostsStatByIds = createCachedHashLoader<bigint, PostStatMapped, PostStat>({
    keyFn: k=>rediskey.post.stats(k),
    fetch: db.getPostsStatByIds,    
    map: (v) => v.id,
    select: (md) => md,
    ttl: 3600000,
    nullTtl: 60,
})
export const getPostStatById= createSingleLoader(getPostsStatByIds)
export function getPostsByIds(ids: bigint[]): Promise<(CachedPost | null)[]>;
export function getPostsByIds(ids: string[]): Promise<(CachedPost | null)[]>;
export function getPostsByIds(ids: (bigint | string)[]) {
    return _getPostsByIdsInternal(ids.map(id => typeof id === "string" ? BigInt(id) : id));
}
const _getPostsByIdsInternal = createCachedBatchLoader2<bigint, CachedPost>({
    keyFn: (id) => rediskey.post.content(id),
    fetch: db.getPostsByIds,
    map: (md) => md.id,
    ttl: 120000,
    nullTtl: 30,
});
export const getPostById =createSingleLoader(getPostsByIds)

export async function getSubredditPosts({
    Id,
    orderBy = "desc",
    take = INFINITE_SCROLLING_PAGINATION_RESULTS,
    cursor,
}: {
    Id: bigint,
    orderBy?: "asc" | "desc"
    take?: number
    cursor?: bigint | number}): Promise<(CachedPost|null)[]  > {
    const list = await db.getSubredditPostIds({Id,orderBy,take,cursor})
    if (!list?.length) return [];
    return (await getPostsByIds(list)) ;
}

export async function getFeedPosts({
    userId,
    orderBy = "desc",
    take = INFINITE_SCROLLING_PAGINATION_RESULTS,
    cursor,
}: {
    userId: bigint
    orderBy?: "asc" | "desc"
    take?: number
    cursor?: bigint | number
}): Promise<(CachedPost | null)[]> {
    const list = await db.getFeedPostIds({ userId, orderBy, take, cursor })
    if (!list?.length) return []
    return getPostsByIds(list)
}

export async function getAllPosts({
    orderBy = "desc",
    take = INFINITE_SCROLLING_PAGINATION_RESULTS,
    cursor,}: {
    orderBy?: "asc" | "desc"
    take?: number
    cursor?: bigint | number}): Promise<(CachedPost | null)[]> {
    const list = await db.getAllPostIds({ orderBy, take, cursor })
    if (!list?.length) return []
    return getPostsByIds(list)
}


const GET_NEXT_IDS_LUA = `
local rank = redis.call("ZREVRANK", KEYS[1], ARGV[1])
if not rank then
    return {}
end
return redis.call("ZREVRANGE", KEYS[1], rank + 1, rank + tonumber(ARGV[2]))
`

export async function getHotPostIds(subredditId: bigint,limit: number,cursor?: bigint,): Promise<bigint[]> {
    const key =rediskey.subreddit.hotrank(subredditId)
    let result
    if(!cursor) result =await redis.zrevrange(key,0,limit)
    else result = await redis.eval(GET_NEXT_IDS_LUA,1,key,cursor.toString(),limit) as string[]
    return result.map(r =>BigInt(r))
  }

  
export async function getTopPostIds(subredditId: bigint,limit: number,cursor?: bigint,): Promise<bigint[]> {
    const key =rediskey.subreddit.toprank(subredditId)
    let result
    if(!cursor) result =await redis.zrevrange(key,0,limit)
    else result = await redis.eval(GET_NEXT_IDS_LUA,1,key,cursor.toString(),limit) as string[]
    return result.map(r =>BigInt(r))
  }
