'use client'
import { UserCreateSubredditPayload } from "@/lib/validators/subreddit";
import axios from "axios"
 
export const createSubreddit = async (payload: UserCreateSubredditPayload) => {
  const { data } = await axios.post("/api/subreddit/create", payload)
  return data as string
}