import { JsonValue } from "@prisma/client/runtime/client"

import { ID } from "./ID"
import { UserDto } from "./Users/dto"
import { VoteType } from "./enum"
import { SubRedditDto } from "./subreddit"
export interface PostStat{
    votesAmt: number
    commentsAmt: number
}
export interface PostStatMapped extends PostStat{
    id:bigint
}
export interface PostDto{
    id: ID            
    creator: UserDto
    subreddit: SubRedditDto 
    content: JsonValue
    title: string
    createdAt: Date      
    lastEdited: Date | null 
    stat:PostStat
}

export interface PostUserDto extends PostDto {
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