import { JsonValue } from "@prisma/client/runtime/client"
import { ID } from "./ID"
import { VoteType } from "@/types/enum"
import { UserDto } from "./Users/dto"


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

