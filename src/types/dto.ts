import { JsonValue } from "@prisma/client/runtime/client"
import { ID } from "./ID"
import { VoteType } from "@/types/enum"


export type UserDto = {
    id: ID
    name: string
    image: string         
}

export type SubRedditDto = {
    id: ID
    name: string
    image: string         
}
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

export interface CommentDto {
    id: bigint;
    content: JsonValue; 
    createdAt: Date;
    latestUpdateAt: Date;
    author: UserDto
    voteAmt:number
    replies?: CommentDto[]; 
  }
export interface CommentPerDto extends CommentDto{
    voteType?:VoteType| null
}
export interface Version {
    v:bigint;
}


export interface SubredditBaseMd extends Version{
    Id:bigint;
    name:string;
    image:string;
}