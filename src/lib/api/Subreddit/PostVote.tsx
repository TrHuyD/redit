'use client'
import { PostVotePayload, PostVoteValidator } from "@/lib/validators/post";

import axios from "axios"
 
export const votePost = async (payload: PostVotePayload) => {
    const validated = PostVoteValidator.parse(payload)
    const {  } = await axios.patch("/api/subreddit/post/vote", payload)
}