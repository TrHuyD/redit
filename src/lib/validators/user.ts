import { SubRedditDto } from "@/types/subreddit";
import z from "zod";
import { zBigInt, zCursorId, zString } from "./generic";

export const UserValidator = z.object({
    userId: zBigInt("userId")
  })
export const UserPostsRetrieveValidator = z.object({
  username : zString("username"),
  cursorId:zCursorId
})
export type UserPayLoad = z.infer<typeof UserValidator> 
export interface UserSubredditHistory {
  subreddits: SubRedditDto[]
}
export type UserPostsRetrievePayload = z.infer<typeof UserPostsRetrieveValidator>