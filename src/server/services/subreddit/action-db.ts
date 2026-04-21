import { db } from "@/lib/db";
import { Result } from "@/lib/Result";
import { CommentUnVoteRequestPayload, CommentVoteRequestPayload, PostUnVoteRequestPayload, PostVoteRequestPayload } from "@/lib/validators/post";
import { UserSubredditRequestPayload } from "@/lib/validators/subreddit";
import { VoteTarget, VoteType } from "@/types/enum";
import { Prisma } from "@prisma/client";
import { Delta as VoteDelta } from "./type";


    


export async function LeaveSubreddit(data: UserSubredditRequestPayload): Promise<Result<null>> {
  const subreddit = await db.subreddit.findUnique({
    where: { id: data.subredditId },
    select: { id: true, creatorId: true }
  })
  if (!subreddit) return { ok: false, error: {code:"404", message: "Subreddit not found" } }
  if (subreddit.creatorId === data.userId) return { ok: false, error: { message: "You can't leave your own subreddit!" } }

  try {
    await db.subscription.delete({
      where: { userId_subredditId: { subredditId: data.subredditId, userId: data.userId } }
    })
    return { ok: true, data: null }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") return { ok: false, error: { code: "409", message: "User is not in this subreddit" } }
    }
    throw err
  }
}

export async function JoinSubreddit(data: UserSubredditRequestPayload) : Promise<Result<null>>{
  try {
      await db.subscription.create({
        data: {
          subredditId: data.subredditId,
          userId: data.userId
        }
      })
      return { ok: true ,data:null}
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002")
          return { ok: false, error: {code:"409", message:"User already joined this subreddit"} }
    
        if (err.code === "P2003") 
          return { ok: false, error:{code:"500",message: "Subreddit not found" }}
      }
    
      throw err
    }
}
async function upsertVote(
  target: VoteTarget,
  id: bigint,
  userId: bigint,
  type: VoteType
): Promise<VoteDelta > {
  if (target === "post") {
    const rows = await db.$queryRaw<{
      old_type: VoteType | null
      subredditId: bigint
      createdAt: Date
    }[]>`
      WITH old AS (
        SELECT "type" 
        FROM "PostVote"
        WHERE "postId" = ${id} AND "userId" = ${userId}
      ),
      post_info AS (
        SELECT "subredditId", "createdAt"
        FROM "Post"
        WHERE "id" = ${id}
      )
      INSERT INTO "PostVote" ("userId", "postId", "type")
      VALUES (${userId}, ${id}, ${type})
      ON CONFLICT ("postId", "userId")
      DO UPDATE SET "type" = ${type}
      RETURNING 
        "postId",
        (SELECT "type" FROM old) AS old_type,
        (SELECT "subredditId" FROM post_info) AS "subredditId",
        (SELECT "createdAt" FROM post_info) AS "createdAt"
    `
    const row = rows[0]
    const old_type = row?.old_type ?? 0
    return { delta: type - old_type, id: row.subredditId, date: row.createdAt }
  } else {
    const rows = await db.$queryRaw<{
      old_type: VoteType | null
      postId: bigint
      createdAt: Date
    }[]>`
      WITH comment_info AS (
        SELECT "postId", "createdAt"
        FROM "Comment"
        WHERE "id" = ${id}
      )
      INSERT INTO "CommentVote" ("userId", "commentId", "type")
      VALUES (${userId}, ${id}, ${type})
      ON CONFLICT ("commentId", "userId")
      DO UPDATE SET "type" = ${type}
      RETURNING 
        (SELECT "type" FROM "CommentVote" WHERE "commentId" = ${id} AND "userId" = ${userId}) AS old_type,
        (SELECT "postId" FROM comment_info) AS postId,
        (SELECT "createdAt" FROM comment_info) AS createdAt
    `
    const row = rows[0]
    const old_type = row?.old_type ?? 0
    return { delta: type - old_type, id: row.postId, date: row.createdAt }
  }
}

async function removeVote(
  target: VoteTarget,
  id: bigint,
  userId: bigint
): Promise<VoteDelta> {
  if (target === "post") {
    const rows = await db.$queryRaw<{
      old_type: VoteType | null
      subredditId: bigint
      createdAt: Date
    }[]>`
      WITH post_info AS (
        SELECT "subredditId", "createdAt"
        FROM "Post"
        WHERE "id" = ${id}
      )
      DELETE FROM "PostVote"
      WHERE "postId" = ${id} AND "userId" = ${userId}
      RETURNING "type" AS old_type,
                (SELECT "subredditId" FROM post_info) AS "subredditId",
                (SELECT "createdAt" FROM post_info) AS "createdAt"
    `
    const row = rows[0]
    const old_type = row?.old_type ?? 0
    return { delta: 0 - old_type, id: row.subredditId, date: row.createdAt }
  } else {
    const rows = await db.$queryRaw<{
      old_type: VoteType | null
      postId: bigint
      createdAt: Date
    }[]>`
      WITH comment_info AS (
        SELECT "postId", "createdAt"
        FROM "Comment"
        WHERE "id" = ${id}
      )
      DELETE FROM "CommentVote"
      WHERE "commentId" = ${id} AND "userId" = ${userId}
      RETURNING "type" AS old_type,
                (SELECT "postId" FROM comment_info) AS postId,
                (SELECT "createdAt" FROM comment_info) AS createdAt
    `
    const row = rows[0]
    const old_type = row?.old_type ?? 0
    return { delta: 0 - old_type, id: row.postId, date: row.createdAt }
  }
}
export async function VotePost(payload: PostVoteRequestPayload): Promise<Result<VoteDelta>>  {
  const result = await upsertVote("post", payload.postId, payload.userId, payload.type)
  return { ok: true, data: result }
}

export async function VoteComment(payload: CommentVoteRequestPayload): Promise<Result<VoteDelta>>  {
  const result = await upsertVote("comment", payload.commentId, payload.userId, payload.voteType)
  return { ok: true, data: result }
}

export async function UnVotePost(payload: PostUnVoteRequestPayload): Promise<Result<VoteDelta>>  {
  const result = await removeVote("post", payload.postId, payload.userId)
  return { ok: true, data: result }
}

export async function UnVoteComment(payload: CommentUnVoteRequestPayload): Promise<Result<VoteDelta>>  {
  const result = await removeVote("comment", payload.commentId, payload.userId)
  return { ok: true, data: result }
}

// export async function DeletePost(payload:PostDeletePayload):Promise<Result<null>>{
//   const 
// }