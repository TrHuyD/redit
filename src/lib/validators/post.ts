
import { VoteType } from '@prisma/client'
import {z} from 'zod'
import { UserValidator } from './user'
import { ID } from '@/types/ID'
import { SortBy } from '@/types/enum'
export const subredditMentionValidator = z.object({
    subredditId: ID.zod(),
})
export const PostValidator = z.object({ 
    title: z.string().min(3, "Title must be at least 3 characters long").max(30, "Title must be less than 30 characters long"),
    content: z.any(),
}).merge(subredditMentionValidator)
export type PostCreationRequest = z.infer<typeof PostValidator>
export const PostVoteValidator = z.object({
    type : z.nativeEnum(VoteType),
    postId : ID.zod()
})
export const PostVoteRequestValidator =PostVoteValidator.merge(UserValidator)
export type PostVotePayload = z.infer<typeof PostVoteValidator>
export type PostVoteRequestPayload = z.infer<typeof PostVoteRequestValidator>

export const SubredditPostRetrieveValidator =z.object(
    {
        limit: z.coerce.number().int().positive().max(50).optional(),
        cursorId: z.coerce.bigint().optional(),
        subredditName : z.string()
    }
)

export type SubredditPostRetrievePayload = z.infer<typeof SubredditPostRetrieveValidator>

export const FeedRetrieveValidator = z.object(
    {
        cursorId: z.coerce.bigint().optional(),
        limit: z.coerce.number().int().positive().max(50).optional(),
        sortBy: z.nativeEnum(SortBy).default(SortBy.NEW)
    }
)

export type FeedRetrievePayLoad = z.infer<typeof FeedRetrieveValidator>