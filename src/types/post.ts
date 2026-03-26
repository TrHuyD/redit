import { JsonValue } from "@prisma/client/runtime/client"
import { SubRedditDto } from "./dto"
import { ID } from "./ID"
import { UserDto } from "./Users/dto"
import { VoteType } from "./enum"

export type PostDto = {
    id: ID            
    creator: UserDto
    subreddit: SubRedditDto 
    votesAmt: number
    content: JsonValue
    title: string
    commentsAmt: number
    createdAt: Date      
    lastEdited: Date | null 
}

export type PostUserDto = PostDto& {
    currentVote: VoteType | null  
}


export interface CachedPost{
    id:bigint,
    creatorId:bigint,
    subredditId:bigint,
    content:JsonValue,
    title:string,
    createdAt:bigint,
    lastEdited: bigint|null
}





export function toCachePost(post: {
    id: bigint,
    authorId: bigint,
    subredditId: bigint,
    content: JsonValue,
    title: string,
    createdAt: Date,
    latestUpdateAt: Date | null,
}): CachedPost {
    return {
        id: post.id,
        creatorId: post.authorId,
        subredditId: post.subredditId,
        content: post.content,
        title: post.title,
        createdAt: BigInt(post.createdAt.getTime()),
        lastEdited: post.latestUpdateAt ? BigInt(post.latestUpdateAt.getTime()) : null,
    }
}