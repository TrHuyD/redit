
import { CachedPost, PostStatMapped, toCachePost } from "@/types/post";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import { UserVote, VoteScore } from "../type";


export async function getCommentVoteScore(ids: bigint[]): Promise<number[]> {
    var rows = await db.commentVote.groupBy({
        by: ['commentId'],
        where: { commentId: { in: ids } },
        _sum: { type: true }
    })
    return rows.map(r => (r._sum.type??0))
}
// export async function getPostCommentCount(ids: bigint[]): Promise<number[]> {
//         const rows = await db.comment.groupBy({
//             by: ['postId'],
//             where: { postId: { in: ids } },
//             _count: { postId: true }
//         })
//         return rows.map(r => r._count.postId)
//     }

// export async function getPostVoteScore(ids: bigint[]): Promise<number[]> {
//         var rows = await db.postVote.groupBy({
//             by: ['postId'],
//             where: { postId: { in: ids } },
//             _sum: { type: true }
//         })
//         return rows.map(r => (  r._sum.type ?? 0))
//     }
export async function getPostsStatByIds(ids: bigint[]): Promise<PostStatMapped[]> {
        const [commentCounts, voteScores] = await Promise.all([
          db.comment.groupBy({
            by: ['postId'],
            where: { postId: { in: ids } },
            _count: { postId: true }
          }),
          db.postVote.groupBy({
            by: ['postId'],
            where: { postId: { in: ids } },
            _sum: { type: true }
          })
        ]);
        const commentMap = new Map<bigint, number>();
        for (const r of commentCounts) {
          commentMap.set(r.postId, r._count.postId);
        }
        const voteMap = new Map<bigint, number>();
        for (const r of voteScores) {
          voteMap.set(r.postId, r._sum.type ?? 0);
        }
        return ids.map(id => ({
          id,
          commentsAmt: commentMap.get(id) ?? 0,
          votesAmt: voteMap.get(id) ?? 0
        }));
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
export async function getUserPostVotes(userId: bigint, postIds: bigint[]): Promise<UserVote[]> {
    const rows = await db.postVote.findMany({
        where: { userId, postId: { in: postIds } },
        select: { postId: true, type: true }
    })
    return rows.map(r => ({ Id: r.postId, type: r.type }))
}

export async function getUserCommentVotes(userId: bigint, commentIds: bigint[]): Promise<UserVote[]> {
    const rows = await db.commentVote.findMany({
        where: { userId, commentId: { in: commentIds } },
        select: { commentId: true, type: true }
    })
    return rows.map(r => ({ Id: r.commentId, type: r.type }))
}