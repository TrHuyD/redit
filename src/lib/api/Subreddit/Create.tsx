'use client'
import { CreateSubredditPayload } from "@/lib/validators/subreddit";
import axios from "axios"
 
export const createSubreddit = async (payload: CreateSubredditPayload) => {
  const { data } = await axios.post("/api/subreddit/create", payload)
  return data as string
}