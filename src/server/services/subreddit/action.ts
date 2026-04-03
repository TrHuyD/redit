import { PostVoteRequestPayload, PostUnVoteRequestPayload, CommentVoteRequestPayload, CommentUnVoteRequestPayload } from "@/lib/validators/post";

import { Result } from "@/lib/Result";
import * as db from "./action-db";
import { Delta as VoteDelta } from "./type";
import { incrCache } from "../cache/util";
import { UserSubredditRequestPayload, UserSubredditVisitRequestPayLoad } from "@/lib/validators/subreddit";
import { incrHashField, pushSortedUnique } from "../cache/Pipeline";
import { rediskey } from "@/types/rediskey";
import { withLockOrSkip } from "../cache/Lock";


export async function VotePost({ type, postId, userId }: PostVoteRequestPayload): Promise<Result<VoteDelta>> {
  const result = await db.VotePost({ type, postId, userId })
  if (result.ok) {
    incrHashField([`post:${postId}:stats`], "votesAmt", result.data.delta)
      .catch(err => console.error("Failed to update post vote cache:", err))
  }
  return result
}
export async function UnVotePost({ postId, userId }: PostUnVoteRequestPayload): Promise<Result<VoteDelta>> {
  const lock = await withLockOrSkip(
    { key: `unvote:post:${postId}:user:${userId}` },
    async () => {
      const result = await db.UnVotePost({ postId, userId })
      if (result.ok) {
        incrHashField([`post:${postId}:stats`], "votesAmt", result.data.delta).catch(err => console.error("Failed to update post vote cache:", err))
      }
      return result
    }
  )
  if (lock.status === "skipped" || lock.status === "error") {
    return { ok: false, error: { code: "LOCKED", message: "Another vote operation is in progress. Please try again." } }
  }
  return lock.data
}

export async function VoteComment({ voteType: type, commentId, userId }: CommentVoteRequestPayload): Promise<Result<VoteDelta>> {
  const lock = await withLockOrSkip(
    { key: `vote:comment:${commentId}:user:${userId}` },
    async () => {
      const result = await db.VoteComment({ voteType: type, commentId, userId })
      if (result.ok) {
        incrHashField([rediskey.comment.stats(commentId)], "votesAmt", result.data.delta).catch(err => console.error("Failed to update comment vote cache:", err))
      }
      return result
    }
  )
  if (lock.status === "skipped" || lock.status === "error") {
    return { ok: false, error: { code: "LOCKED", message: "Another vote operation is in progress. Please try again." } }
  }
  return lock.data
}

export async function UnVoteComment({ commentId, userId }: CommentUnVoteRequestPayload): Promise<Result<VoteDelta>> {
  const lock = await withLockOrSkip(
    { key: `unvote:comment:${commentId}:user:${userId}` },
    async () => {
      const result = await db.UnVoteComment({ commentId, userId })
      if (result.ok) {
        incrHashField([rediskey.comment.stats(commentId)], "votesAmt", result.data.delta).catch(err => console.error("Failed to update comment vote cache:", err))
      }
      return result
    }
  )
  if (lock.status === "skipped" || lock.status === "error") {
    return { ok: false, error: { code: "LOCKED", message: "Another vote operation is in progress. Please try again." } }
  }
  return lock.data
}

export async function JoinSubreddit(data: UserSubredditRequestPayload): Promise<Result<null>> {
  const lock = await withLockOrSkip(
    { key: `join:subreddit:${data.subredditId}:user:${data.userId}` },
    async () => {
      const result = await db.JoinSubreddit(data)
      if (result.ok) {
        incrCache(rediskey.subreddit.membercount(data.subredditId), 1).catch(err => console.error("Failed to update subreddit member cache:", err))
      }
      return result
    }
  )
  if (lock.status === "skipped" || lock.status === "error") {
    return { ok: false, error: { code: "LOCKED", message: "Another join/leave operation is in progress. Please try again." } }
  }
  return lock.data
}

export async function LeaveSubreddit(data: UserSubredditRequestPayload): Promise<Result<null>> {
  const lock = await withLockOrSkip(
    { key: `leave:subreddit:${data.subredditId}:user:${data.userId}` },
    async () => {
      const result = await db.LeaveSubreddit(data)
      if (result.ok) {
        incrCache(rediskey.subreddit.membercount(data.subredditId), -1).catch(err => console.error("Failed to update subreddit member cache:", err))
      }
      return result
    }
  )
  if (lock.status === "skipped" || lock.status === "error") {
    return { ok: false, error: { code: "LOCKED", message: "Another join/leave operation is in progress. Please try again." } }
  }
  return lock.data
}
export async function MarkVisit(data :UserSubredditVisitRequestPayLoad) :Promise<Result<null>>{
    await pushSortedUnique(rediskey.user.subHistory(data.userId),data.subredditId,rediskey.user.subHistoryLimit) 
    return {ok:true,data: null}
}
