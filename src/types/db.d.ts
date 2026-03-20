import { Post, Subreddit,Comment ,User,PostVote } from "@prisma/client"

export type ExtendedPost = Post &{
subreddit:Subreddit,
votes:PostVote[],
author:User,
comments:Comment[]
} 