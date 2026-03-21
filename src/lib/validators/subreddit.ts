import {z} from "zod"
import { UserValidator } from "./user"
import { ID } from "@/types/ID"
export const SubredditValidator = z.object({
    name: z.string().min(3).max(21).regex(/^[a-zA-Z0-9_]+$/, "Subreddit name can only contain letters, numbers, and underscores")
})
export const SubscriptionValidator = z.object({
    subredditId: ID.zod()
})
export type UserCreateSubredditPayload = z.infer<typeof SubredditValidator>
export type SubscribeToSubredditPayload = z.infer<typeof SubscriptionValidator>



export const CreateSubredditRequestValidator = SubredditValidator.merge(UserValidator)
export const UserSubredditRequestValidator = SubscriptionValidator.merge(UserValidator)
export type CreateSubredditRequestPayload = z.infer<typeof CreateSubredditRequestValidator>
export type UserSubredditRequestPayload = z.infer<typeof UserSubredditRequestValidator>