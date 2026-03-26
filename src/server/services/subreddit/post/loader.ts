import { createSingleLoader } from "@/lib/utils"
import { createCachedBatchLoader, createCachedBatchLoader2 } from "../../cache/Pipeline"
import { VoteScore } from "../type"
import * as db from "./repo";
import { CachedPost } from "@/types/post";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
export const getPostsVoteScore = createCachedBatchLoader<bigint,VoteScore,number>({
    keyFn: (id) => `post:${id}:vote`,
    fetch: db.getPostVoteScore,
    map: (md) => md.Id,
    select: (md) => md?.Count ?? null,
    ttl: 1200000,
    nullTtl: 30,
  })
export const getCommentsVoteScore = createCachedBatchLoader<bigint,VoteScore,number>({
    keyFn: (id) => `comment:${id}:vote`,
    fetch: db.getCommentVoteScore,
    map: (md) => md.Id,
    select: (md) => md?.Count ?? null,
    ttl: 1200000,
    nullTtl: 30,
    })
export const getPostVoteScore =createSingleLoader(getPostsVoteScore)
export const getCommentVoteScore =createSingleLoader(getCommentsVoteScore)
export const getPostsByIds= createCachedBatchLoader2<bigint,CachedPost>({
    keyFn: (id) => `post:${id}`,
    fetch: db.getPostsByIds,
    map: (md) => md.id,
    ttl: 120,
    nullTtl: 30,
})
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
