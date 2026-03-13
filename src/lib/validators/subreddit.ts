import {z} from "zod"
export const SubredditValidator = z.object({
    name: z.string().min(3).max(21).regex(/^[a-zA-Z0-9_]+$/, "Subreddit name can only contain letters, numbers, and underscores")
})
export const SubscriptionValidator = z.object({
    subredditId: z.string().min(1, "Subreddit ID is required")
})
export type UserCreateSubredditPayload = z.infer<typeof SubredditValidator>
export type SubscribeToSubredditPayload = z.infer<typeof SubscriptionValidator>



export const CreateSubredditRequestValidator = z.object({
    name: z.string().min(3).max(21).regex(/^[a-zA-Z0-9_]+$/, "Subreddit name can only contain letters, numbers, and underscores"),
    userId: z.string().min(1, "User ID is required")
})

export type CreateSubredditRequestPayload = z.infer<typeof CreateSubredditRequestValidator>