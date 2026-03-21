import { JsonValue } from "@prisma/client/runtime/client"
import { ID } from "./ID"
import { VoteType } from "@prisma/client"


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
    currentVote: VoteType | null  
    content: JsonValue
    title: string
    commentsAmt: number
    createdAt: Date      
    lastEdited: Date | null 
}
