import {UserSubredditRequestPayload } from "@/lib/validators/subreddit";
import {db} from "@/lib/db"
import { Result } from "@/lib/Result"
import { Prisma } from "@prisma/client";
import {  CommentUnVoteRequestPayload, CommentVoteRequestPayload, PostUnVoteRequestPayload, PostVoteRequestPayload } from "@/lib/validators/post";
import { error } from "node:console";
import { VoteType } from "@/types/enum";
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
  

export async function VotePost({ type, postId, userId }: PostVoteRequestPayload): Promise<Result<VoteDelta>> {
  const rows = await db.$queryRaw<{ old_type: VoteType | null }[]>`
    WITH old AS (
      SELECT "type" FROM "PostVote"
      WHERE "postId" = ${postId} AND "userId" = ${userId}
    )
    INSERT INTO "PostVote" ("userId", "postId", "type")
    VALUES (${userId}, ${postId}, ${type})
    ON CONFLICT ("postId", "userId")
    DO UPDATE SET "type" = ${type}
    RETURNING (SELECT "type" FROM old) AS old_type`
  const old_type = rows[0]?.old_type ?? 0
  const delta = type - old_type
  return { ok: true, data: { delta } }
}

export async function VoteComment({ voteType: type, commentId, userId }: CommentVoteRequestPayload): Promise<Result<VoteDelta>> {
  const rows = await db.$queryRaw<{ old_type: VoteType | null }[]>`
    INSERT INTO "CommentVote" ("userId", "commentId", "type")
    VALUES (${userId}, ${commentId}, ${type})
    ON CONFLICT ("commentId", "userId")
    DO UPDATE SET "type" = ${type}
    RETURNING (SELECT "type" FROM "CommentVote" 
               WHERE "commentId" = ${commentId} 
               AND "userId" = ${userId}) AS old_type`
  const old_type = rows[0]?.old_type ?? 0
  const delta = type - old_type
  return { ok: true, data: { delta } }
}

export async function UnVotePost({ postId, userId }: PostUnVoteRequestPayload): Promise<Result<VoteDelta>> {
  const rows = await db.$queryRaw<{ old_type: VoteType | null }[]>`
    DELETE FROM "PostVote"
    WHERE "postId" = ${postId} AND "userId" = ${userId}
    RETURNING "type" AS old_type`
  const old_type = rows[0]?.old_type ?? 0
  const delta = 0 - old_type
  return { ok: true, data: { delta } }
}

export async function UnVoteComment({ commentId, userId }: CommentUnVoteRequestPayload): Promise<Result<VoteDelta>> {
  const rows = await db.$queryRaw<{ old_type: VoteType | null }[]>`
    DELETE FROM "CommentVote"
    WHERE "commentId" = ${commentId} AND "userId" = ${userId}
    RETURNING "type" AS old_type`
  const old_type = rows[0]?.old_type ?? 0
  const delta = 0 - old_type
  return { ok: true, data: { delta } }
}