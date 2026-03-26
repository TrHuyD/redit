'use client'
import { PostUnVotePayload, PostUnVoteValidator, PostVotePayload, PostVoteValidator } from "@/lib/validators/post";

import axios from "axios"
 
export const votePost = async (payload: PostVotePayload) => {
    const validated = PostVoteValidator.parse(payload)
    const {  } = await axios.patch("/api/subreddit/post/vote", payload)
}
export const unVotePost = async (payload: PostUnVotePayload) => {
    const validated = PostUnVoteValidator.parse(payload)
    const {  } = await axios.patch("/api/subreddit/post/unvote", payload)
}
    