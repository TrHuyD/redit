import { JsonValue } from "@prisma/client/runtime/client"
import { ID } from "./ID"
import { VoteType } from "@/types/enum"
import { UserDto } from "./Users/dto"


export type SubRedditDto = {
    id: ID
    name: string
    image: string         
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

export interface SubredditMinimalMd{
    Id:bigint,
    name:string,
}
export interface SubredditBaseMd extends Version,SubredditMinimalMd{
    image:string;
    createdAt:bigint;
    latestUpdateAt:bigint;
    creatorId: bigint;
}
export interface UserSubredditBaseMd extends SubredditBaseMd{
    isCreator:boolean,
    isMember:boolean,
    userCount:number
}