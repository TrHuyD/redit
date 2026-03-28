
import {  createCachedBatchLoader2, createCachedHashLoader } from "../../cache/Pipeline"

import * as db from "./repo";
import { CachedPost, PostStat, PostStatMapped } from "@/types/post";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { createSingleLoader } from "@/lib/utils";


export const getPostsStatByIds = createCachedHashLoader<bigint, PostStatMapped, PostStat>({
    keyFn: (id) => `post:${id}:stats`,
    fetch: db.getPostsStatByIds,    
    map: (v) => v.id,
    select: (md) => md,
    ttl: 36000,
    nullTtl: 60,
})
export const getPostStatById= createSingleLoader(getPostsStatByIds)
export const getPostsByIds= createCachedBatchLoader2<bigint,CachedPost>({
    keyFn: (id) => `post:${id}`,
    fetch: db.getPostsByIds,
    map: (md) => md.id,
    ttl: 1200,
    nullTtl: 30,
})
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
    cursor,
}: {
    orderBy?: "asc" | "desc"
    take?: number
    cursor?: bigint | number
}): Promise<(CachedPost | null)[]> {
    const list = await db.getAllPostIds({ orderBy, take, cursor })
    if (!list?.length) return []
    return getPostsByIds(list)
}