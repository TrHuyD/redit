import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import * as cache from "./loader"
import { PostUserDto } from "@/types/post"
import { getUsersById } from "../../user/loader"
import { getSubredditId, getSubredditMetadata } from "../loader"

import { getUserPostVotes } from "./repo"
import { filterNull, toMap, zipToMap } from "@/lib/utils"



export async function getSubredditPosts({
    slug,
    orderBy = "desc",
    take = INFINITE_SCROLLING_PAGINATION_RESULTS,
    cursor,
    userId,
}: {
    slug: string,
    orderBy?: "asc" | "desc"
    take?: number
    cursor?: bigint ,
    userId?:bigint
}): Promise<PostUserDto[]> {
    const Id = await getSubredditId(slug);
    if (!Id) return [];
    const posts = filterNull( await cache.getSubredditPosts({ Id, orderBy, take, cursor }));
    const postIds = posts.map(p =>(p.id));
    if (!posts.length||!posts) return [];
    const uniqueUserIds = [...new Set(posts.map(p => p.creatorId))];
    const [users, subreddit,userVotes,postStats] = await Promise.all([
        getUsersById(uniqueUserIds),
        getSubredditMetadata(Id),
        userId?getUserPostVotes(userId, postIds):[],
        cache.getPostsStatByIds(postIds)]);
    if (!subreddit) return [];
    const userMap = toMap(users, u=>u.id.toString());
    const userVoteMap = toMap(userVotes, v=>v.Id.toString());
    const postStatMap = zipToMap(postIds, postStats)
    return posts.map<PostUserDto>((p) => ({
        id: p.id,
        title: p.title,
        content: p.content,
        createdAt: new Date(Number(p.createdAt)),
        lastEdited: p.lastEdited ? new Date(Number(p.lastEdited)) : null,
        stat: postStatMap.get(p.id.toString())!,
        currentVote: userVoteMap.get(p.id.toString())?.type??null,
        creator: userMap.get(p.creatorId.toString())!,
        subreddit: {
            id: subreddit.Id,
            name: subreddit.name,
            image: subreddit.image,
        }
    }));
}

export async function getPostById({
    postId,
    userId,
}: {
    postId: bigint
    userId?: bigint
}): Promise<PostUserDto | null> {
    const post = await cache.getPostById(postId)
    if (!post) return null

    const [user, subreddit, userVotes, postStats] = await Promise.all([
        getUsersById([post.creatorId]),
        getSubredditMetadata(post.subredditId),
        userId ? getUserPostVotes(userId, [postId]) : [],
        cache.getPostsStatByIds([postId]),
    ])

    if (!subreddit) return null

    const userMap = toMap(user, u => u.id.toString())
    const userVoteMap = toMap(userVotes, v => v.Id.toString())
    const postStatMap = zipToMap([postId], postStats)

    return {
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: new Date(Number(post.createdAt)),
        lastEdited: post.lastEdited ? new Date(Number(post.lastEdited)) : null,
        stat: postStatMap.get(postId.toString())!,
        currentVote: userVoteMap.get(postId.toString())?.type ?? null,
        creator: userMap.get(post.creatorId.toString())!,
        subreddit: {
            id: subreddit.Id,
            name: subreddit.name,
            image: subreddit.image,
        },
    }
}