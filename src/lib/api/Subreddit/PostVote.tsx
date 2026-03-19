'use client'
import { PostVoteRequest, PostVoteValidator } from "@/lib/validators/post";

import axios from "axios"
 
export const votePost = async (payload: PostVoteRequest) => {
    const validated = PostVoteValidator.parse(payload)
  const {  } = await axios.post("/api/post/vote", payload)
}