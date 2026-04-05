import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import * as cache from "./loader"
import { PostUserDto } from "@/types/post"
import { getUsersById } from "../../user/loader"
import { getSubredditId, getSubredditsMetadata } from "../loader"

import { getAllPostIds, getFeedPostIds, getSubredditPostIds, getUserPostVotes } from "./repo"
import { filterNull, toMap, zipToMap } from "@/lib/utils"


export async function getPostsWithMeta(
    postIds: bigint[],
    userId?: bigint
): Promise<PostUserDto[]> {
    if (!postIds.length) return []

    const posts = filterNull(await cache.getPostsByIds(postIds))
    if (!posts.length) return []

    const uniqueUserIds = [...new Set(posts.map(p => p.creatorId))]
    const uniqueSubredditIds = [...new Set(posts.map(p => p.subredditId))]

    const [users, subreddits, userVotes, postStats] = await Promise.all([
        getUsersById(uniqueUserIds),
        getSubredditsMetadata(uniqueSubredditIds),
        userId ? getUserPostVotes(userId, postIds) : [],
        cache.getPostsStatByIds(postIds),
    ])

    const userMap = toMap(users, u => u.id.toString())
    const subredditMap = toMap(filterNull(subreddits), s => s.Id.toString())
    const userVoteMap = toMap(userVotes, v => v.Id.toString())
    const postStatMap = zipToMap(postIds, postStats)

    return filterNull(posts.map<PostUserDto | null>(p => {
        const subreddit = subredditMap.get(p.subredditId.toString())
        if (!subreddit) return null
        return {
            id: p.id,
            title: p.title,
            content: p.content,
            createdAt: new Date(Number(p.createdAt)),
            lastEdited: p.lastEdited ? new Date(Number(p.lastEdited)) : null,
            stat: postStatMap.get(p.id.toString())!,
            currentVote: userVoteMap.get(p.id.toString())?.type ?? null,
            creator: userMap.get(p.creatorId.toString())!,
            subreddit: {
                Id: subreddit.Id,
                name: subreddit.name,
                image: subreddit.image,
            },
        }
    }))
}

export async function getSubredditPosts(
    {slug,orderBy = "desc",take = INFINITE_SCROLLING_PAGINATION_RESULTS,cursor,userId,}: 
    {slug: string,orderBy?: "asc" | "desc",take?: number, cursor?: bigint,userId?: bigint}) {
    const Id = await getSubredditId(slug)
    if (!Id) return null
    const postIds = await getSubredditPostIds({ Id, orderBy, take, cursor })
    const posts= await getPostsWithMeta(postIds, userId)
    return  {subId:Id, posts:posts }
}
export async function getSubredditHotPosts(
    {slug,take = INFINITE_SCROLLING_PAGINATION_RESULTS,cursor,userId,}: 
    {slug: string,take?: number, cursor?: bigint,userId?: bigint}) {
    const Id = await getSubredditId(slug)
    if (!Id) return null
    const postIds = await cache.getHotPostIds( Id, take, cursor )
    const posts= await getPostsWithMeta(postIds, userId)
    return  {subId:Id, posts:posts }
}
export async function getSubredditTopPosts(
    {slug,take = INFINITE_SCROLLING_PAGINATION_RESULTS,cursor,userId,}: 
    {slug: string,take?: number, cursor?: bigint,userId?: bigint}) {
    const Id = await getSubredditId(slug)
    if (!Id) return null
    const postIds = await cache.getTopPostIds( Id, take, cursor )
    const posts= await getPostsWithMeta(postIds, userId)
    return  {subId:Id, posts:posts }
}

export async function getPostById({
    postId,
    userId,
}: {
    postId: bigint
    userId?: bigint
}): Promise<PostUserDto | null> {
    const results = await getPostsWithMeta([postId], userId)
    return results[0] ?? null
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
    cursor?: bigint
}): Promise<PostUserDto[]> {
    const postIds = await getFeedPostIds({ userId, orderBy, take, cursor })
    return getPostsWithMeta(postIds, userId)
}

export async function getAllPosts({
    userId,
    orderBy = "desc",
    take = INFINITE_SCROLLING_PAGINATION_RESULTS,
    cursor,
}: {
    userId?: bigint
    orderBy?: "asc" | "desc"
    take?: number
    cursor?: bigint
}): Promise<PostUserDto[]> {
    const postIds = await getAllPostIds({ orderBy, take, cursor })
    return getPostsWithMeta(postIds, userId)
}