
import { VoteType } from '@prisma/client'
import {z} from 'zod'
import { UserValidator } from './user'
export const PostValidator = z.object({ 
    title: z.string().min(3, "Title must be at least 3 characters long").max(30, "Title must be less than 30 characters long"),
    subredditId: z.string(),
    content: z.any(),
})
export type PostCreationRequest = z.infer<typeof PostValidator>

export const PostVoteValidator = z.object({
    type : z.nativeEnum(VoteType),
    postId : z.string()
})
export const PostVoteRequestValidator =PostVoteValidator.merge(UserValidator)
export type PostVotePayload = z.infer<typeof PostVoteValidator>
export type PostVoteRequestPayload = z.infer<typeof PostVoteRequestValidator>