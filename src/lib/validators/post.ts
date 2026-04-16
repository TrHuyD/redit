
import { ID } from '@/types/ID'
import { SortBy, VoteType } from '@/types/enum'
import { z } from 'zod'
import { UserValidator } from './user'
export const subredditMentionValidator = z.object({
    subredditId: ID.zod().optional(),
})

const EditorBlock = z.object({
    id: z.string().optional(),
    type: z.string(),
    data: z.any(),
  })
export const EditorContentSchema = z.object({
time: z.number().optional(),
blocks: z.array(EditorBlock),
version: z.string().optional(),
})
export const PostValidator = z.object({ 
    title: z.string().min(3, "Title must be at least 3 characters long").max(30, "Title must be less than 30 characters long"),
    content: EditorContentSchema.nullable().optional(),
    mediaKeys: z.array(z.string()).default([]),
}).merge(subredditMentionValidator)
export type PostCreationRequest = z.infer<typeof PostValidator>
export const PostVoteValidator = z.object({
    type: z.nativeEnum(VoteType),
    postId : z.coerce.bigint()
})
export const PostUnVoteValidator = z.object({
    postId :z.coerce.bigint()
})
export const PostVoteRequestValidator =PostVoteValidator.merge(UserValidator)
export const PostUnVoteRequestValidator =PostUnVoteValidator.merge(UserValidator)

export type PostVotePayload = z.infer<typeof PostVoteValidator>
export type PostVoteRequestPayload = z.infer<typeof PostVoteRequestValidator>

export type PostUnVotePayload = z.infer<typeof PostUnVoteValidator>
export type PostUnVoteRequestPayload = z.infer<typeof PostUnVoteRequestValidator>
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

export const CreateCommentValidator = z.object({
    postId: z.coerce.bigint(),
    content: z.any().refine((val) => val !== null, {
        message: 'Content is required',
      }),
    parentId:z.coerce.bigint().nullish(),
  })


export const CommentContentValidator = z.object({
    text : z.string().min(1,"Invalid comment (Size==0)").max(250,"Invalid comment (Size>250)"),
    media : z.string().max(250,"Invalid comment (Size>250)").optional()
})


export const CommentVoteValidator = z.object({
    voteType: z.nativeEnum(VoteType),
    commentId: ID.zod(),
})
export const CommentUnVoteValidator = z.object({
    commentId: ID.zod()
})
export const CommentVoteRequestValidator = CommentVoteValidator.merge(UserValidator)
export const CommentUnVoteRequestValidator = CommentUnVoteValidator.merge(UserValidator)
export type CommentVotePayload = z.infer<typeof CommentVoteValidator>
export type CommentUnVotePayload = z.infer<typeof CommentUnVoteValidator>
export type CommentUnVoteRequestPayload = z.infer<typeof CommentUnVoteRequestValidator>
export type CommentVoteRequestPayload = z.infer<typeof CommentVoteRequestValidator>



export type CreateCommentPayLoad = z.infer<typeof CreateCommentValidator>
export type CommentContentPayLoad = z.infer<typeof CommentContentValidator>

