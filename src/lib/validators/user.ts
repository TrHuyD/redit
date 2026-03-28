import { ID } from "@/types/ID";
import { SubRedditDto } from "@/types/subreddit";
import z from "zod";

export const UserValidator = z.object({
    userId: ID.zod()
  })
export interface UserSubredditHistory {
  subreddits: SubRedditDto[]
}