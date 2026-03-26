
import { CachedPost, toCachePost } from "@/types/post";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import { VoteScore } from "../type";


export async function getPostVoteScore(ids: bigint[]): Promise<VoteScore[]> {
    var rows = await db.postVote.groupBy({
        by: ['postId'],
        where: { postId: { in: ids } },
        _sum: { type: true }
    })
    return rows.map(r => ({ Id: r.postId, Count: r._sum.type ?? 0 }))
}

export async function getCommentVoteScore(ids: bigint[]): Promise<VoteScore[]> {
    var rows = await db.commentVote.groupBy({
        by: ['commentId'],
        where: { commentId: { in: ids } },
        _sum: { type: true }
    })
    return rows.map(r => ({ Id: r.commentId, Count: r._sum.type ?? 0 }))
}

export async function getSubredditPosts({
    Id,
    orderBy = "desc",
    take = INFINITE_SCROLLING_PAGINATION_RESULTS,
    cursor,
}: {
    Id: bigint,
    orderBy?: "asc" | "desc"
    take?: number
    cursor?: bigint | number
}): Promise<CachedPost[] > {
    const posts = await db.post.findMany({
        where: { subredditId: Id},
        select: {
            id: true,
            authorId: true,
            subredditId: true,
            content: true,
            title: true,
            createdAt: true,
            latestUpdateAt: true,
        },
        orderBy: { id: orderBy },
        take,
        ...(cursor && {
            cursor: { id: cursor },
            skip: 1,
        }),
    })
    return posts.map(toCachePost)
}

export async function getPostsByIds(Ids: bigint[]): Promise<CachedPost[]> {
    const posts = await db.post.findMany({
        where: { id: { in: Ids } },
        select: {
            id: true,
            authorId: true,
            subredditId: true,
            content: true,
            title: true,
            createdAt: true,
            latestUpdateAt: true,
        }})
    return posts.map(toCachePost)
}

export async function getSubredditPostIds({
    Id,
    orderBy = "desc",
    take = INFINITE_SCROLLING_PAGINATION_RESULTS,
    cursor,
}: {
    Id: bigint,
    orderBy?: "asc" | "desc"
    take?: number
    cursor?: bigint | number
}): Promise<bigint[]> {
    const posts = await db.post.findMany({
        where: { subredditId: Id },
        select: { id: true },
        orderBy: { id: orderBy },
        take,
        ...(cursor && {
            cursor: { id: cursor },
            skip: 1,
        }),
    })
    return posts.map(p => p.id)
}

