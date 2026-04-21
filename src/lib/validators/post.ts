import { ID } from "@/types/ID";
import { SortBy, VoteType } from "@/types/enum";
import { z } from "zod";
import { zBigInt, zString } from "./generic";
import { UserValidator } from "./user";


export const zTitle = zString("Title")
  .min(3, "Title must be at least 3 characters long")
  .max(30, "Title must be less than 30 characters long");

export const zShortText = (field: string, max = 250) =>
  zString(field)
    .min(1, `${field} cannot be empty`)
    .max(max, `${field} is too long`);


export const subredditMentionValidator = z.object({
  subredditId: ID.zod(),
});

const EditorBlock = z.object({
  id: zString("id"),
  type: zString("type"),
  data: z.any(),
});
export const EditorContentSchema = z.object({
  time: z.number(),
  blocks: z.array(EditorBlock),
  version: z.string(),
});
export const PostValidator = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters long").max(30, "Title must be less than 30 characters long"),
    content: EditorContentSchema,
    mediaKeys: z.array(z.string()).default([]),
  })
  .merge(subredditMentionValidator);

const EditorBlockUI = z.object({
  id: z.string().optional(),
  type: z.string(),
  data: z.any(),
});
const EditorContentUI = z.object({
  time: z.number().optional(),
  blocks: z.array(EditorBlockUI),
  version: z.string().optional(),
});

export const PostUISchema = z.object({
  title: z.string().min(1, "Title is required").max(30),

  content: EditorContentUI.optional().nullable(),

  mediaKeys: z.array(z.string()).default([]),

  subredditId: ID.zod().optional(),
});
export type PostCreationRequest = z.infer<typeof PostValidator>;
export const PostVoteValidator = z.object({
  type: z.nativeEnum(VoteType),
  postId:  zBigInt("post id")
});
export const PostUnVoteValidator = z.object({
  postId:  zBigInt("post id")
});
export const PostDeleteValidator = z.object({
  postId : zBigInt("post id")
})
export const PostDeleteUserValidator = z.object({
  userId : zBigInt("user id")
}).merge(PostDeleteValidator)
export const PostVoteRequestValidator = PostVoteValidator.merge(UserValidator);
export const PostUnVoteRequestValidator = PostUnVoteValidator.merge(UserValidator);

export type PostVotePayload = z.infer<typeof PostVoteValidator>;
export type PostVoteRequestPayload = z.infer<typeof PostVoteRequestValidator>;

export type PostUnVotePayload = z.infer<typeof PostUnVoteValidator>;
export type PostDeletePayload = z.infer<typeof PostDeleteValidator>;
export type PostUnVoteRequestPayload = z.infer<typeof PostUnVoteRequestValidator>;
export const SubredditPostRetrieveValidator = z.object({
  limit: z.coerce.number().int().positive().max(50).optional(),
  cursorId: z.coerce.bigint().optional(),
  subredditName: z.string(),
});

export type SubredditPostRetrievePayload = z.infer<typeof SubredditPostRetrieveValidator>;

export const FeedRetrieveValidator = z.object({
  cursorId: z.coerce.bigint().optional(),
  limit: z.coerce.number().int().positive().max(50).optional(),
  sortBy: z.nativeEnum(SortBy).default(SortBy.NEW),
});

export type FeedRetrievePayLoad = z.infer<typeof FeedRetrieveValidator>;

export const CreateCommentValidator = z.object({
  postId: z.coerce.bigint(),
  content: z.any().refine((val) => val !== null, {
    message: "Content is required",
  }),
  parentId: z.coerce.bigint().nullish(),
});

export const CommentContentValidator = z.object({
  text: z.string().min(1, "Invalid comment (Size==0)").max(25000, "Invalid comment (Size>25000)"),
  media: z.string().max(250, "Invalid comment (Size>250)").optional(),
});

export const CommentVoteValidator = z.object({
  voteType: z.nativeEnum(VoteType),
  commentId: ID.zod(),
});
export const CommentUnVoteValidator = z.object({
  commentId: ID.zod(),
});
export const CommentVoteRequestValidator = CommentVoteValidator.merge(UserValidator);
export const CommentUnVoteRequestValidator = CommentUnVoteValidator.merge(UserValidator);
export type CommentVotePayload = z.infer<typeof CommentVoteValidator>;
export type CommentUnVotePayload = z.infer<typeof CommentUnVoteValidator>;
export type CommentUnVoteRequestPayload = z.infer<typeof CommentUnVoteRequestValidator>;
export type CommentVoteRequestPayload = z.infer<typeof CommentVoteRequestValidator>;

export type CreateCommentPayLoad = z.infer<typeof CreateCommentValidator>;
export type CommentContentPayLoad = z.infer<typeof CommentContentValidator>;
