import { Post, Subreddit,Comment ,User,PostVote, CommentVote } from "@prisma/client"
import { UserDto } from "./dto"

export type ExtendedPost = Post &{
subreddit:Subreddit,
votes:PostVote[],
author:User,
comments:Comment[]
} 
export type ExtendedComment = Comment &{
    author : UserDto,
    replies?:ExtendedComment[]
    votes : CommentVote[]
}
