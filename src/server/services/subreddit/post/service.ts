import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import * as cache from "./repo"
import { PostUserDto } from "@/types/post"
import { getUsersById } from "../../user/loader"
import { getSubredditId, getSubredditMetadata } from "../loader"
import { id } from "date-fns/locale"
import { UserDto } from "@/types/Users/dto"


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
    const posts = await cache.getSubredditPosts({ Id, orderBy, take, cursor });
    if (!posts.length) return [];
    const uniqueUserIds = [...new Set(posts.map(p => p.creatorId))];
    const [users, subreddit] = await Promise.all([
        getUsersById(uniqueUserIds),
        getSubredditMetadata(Id)
    ]);
    if (!subreddit) return [];
    const userMap = new Map<string, UserDto>();
    for (const u of users) {
        if(u)
            userMap.set(u.id.toString(), u);
    }
    return posts.map<PostUserDto>((p) => ({
        id: p.id,
        title: p.title,
        content: p.content,
        createdAt: new Date(Number(p.createdAt)),
        lastEdited: p.lastEdited ? new Date(Number(p.lastEdited)) : null,
        votesAmt: 0,
        commentsAmt: 0,
        currentVote: null,
        creator: userMap.get(p.creatorId.toString())!,
        subreddit: {
            id: subreddit.Id,
            name: subreddit.name,
            image: subreddit.image,
        }
    }));
}