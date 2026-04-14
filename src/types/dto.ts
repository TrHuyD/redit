import { VoteType } from "@/types/enum";
import { JsonValue } from "@prisma/client/runtime/client";
import { UserDto } from "./user";


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

