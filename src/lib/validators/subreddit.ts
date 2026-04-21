import { ID } from "@/types/ID"
import { z } from "zod"
import { UserValidator } from "./user"
export const SubredditValidator = z.object({
    name: z.string().min(3).max(21).regex(/^[a-zA-Z0-9_]+$/, "Subreddit name can only contain letters, numbers, and underscores")
})
export const SubredditIdValidator = z.object({
    subredditId: ID.zod()
})
export type UserCreateSubredditPayload = z.infer<typeof SubredditValidator>
export type SubscribeToSubredditPayload = z.infer<typeof SubredditIdValidator>



export const CreateSubredditRequestValidator = SubredditValidator.merge(UserValidator).merge(z.object({
    avatarImage: z.string().url().optional(),
    bannerImage: z.string().url().optional(),
    description: z.string().optional()
}))
export const UserSubredditRequestValidator = SubredditIdValidator.merge(UserValidator)
export type CreateSubredditRequestPayload = z.infer<typeof CreateSubredditRequestValidator>
export type UserSubredditRequestPayload = z.infer<typeof UserSubredditRequestValidator>

export const UserSubredditVisistRequestValidator = z.object({
    subredditId : z.coerce.bigint(),
    userId:z.coerce.bigint(),
})
export type UserSubredditVisitRequestPayLoad = z.infer<typeof UserSubredditRequestValidator>
export const SearchSubreditACValidator = z.object({
    name:z.string().max(30)
})
export type SearchSubredditACPayload =z.infer<typeof SearchSubreditACValidator>

