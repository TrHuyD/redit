import { CommentUnVoteRequestPayload, CommentVoteRequestPayload, PostUnVoteRequestPayload, PostVoteRequestPayload } from "@/lib/validators/post";

import { Result } from "@/lib/Result";
import { UserSubredditRequestPayload, UserSubredditVisitRequestPayLoad } from "@/lib/validators/subreddit";
import { redis } from "@/server/lib/redis";
import { rediskey } from "@/types/rediskey";
import { withLockOrSkip } from "../cache/Lock";
import { incrHashField, incrHashFields, pushSortedUnique } from "../cache/Pipeline";
import { incrCache } from "../cache/util";
import * as db from "./action-db";
import { hotScore } from "./post/hotscore";
import { Delta as VoteDelta } from "./type";


export async function VotePost({ type, postId, userId }: PostVoteRequestPayload): Promise<Result<VoteDelta>> {
  const result = await db.VotePost({ type, postId, userId })
  if (result.ok) {
   await ReCalculatePostRank({postId,delta:result.data})
  }
  return result
}
export async function UnVotePost({ postId, userId }: PostUnVoteRequestPayload): Promise<Result<VoteDelta>> {
  const lock = await withLockOrSkip(
    { key: `unvote:post:${postId}:user:${userId}` },
    async () => {
      const result = await db.UnVotePost({ postId, userId })
      if (result.ok) {
        await ReCalculatePostRank({postId,delta:result.data})
      }
      return result
    }
  )
  if (lock.status === "skipped" || lock.status === "error") {
    return { ok: false, error: { code: "LOCKED", message: "Another vote operation is in progress. Please try again." } }
  }
  return lock.data
}
async function ReCalculatePostRank( {postId,delta}:{delta:VoteDelta,postId:bigint}){
  if(delta.delta==0)
      return;
    var newScore =await incrHashField(rediskey.post.stats(postId), "votesAmt", delta.delta)
    var newHot= hotScore(newScore,delta.date.getTime())
    var pipeline = redis.pipeline()
    pipeline.zadd(rediskey.subreddit.hotrank(delta.id),newHot,postId.toString())
    pipeline.zadd(rediskey.subreddit.toprank(delta.id),newScore,postId.toString())
    await pipeline.exec()
}

export async function VoteComment({ voteType: type, commentId, userId }: CommentVoteRequestPayload): Promise<Result<VoteDelta>> {
  const lock = await withLockOrSkip(
    { key: `vote:comment:${commentId}:user:${userId}` },
    async () => {
      const result = await db.VoteComment({ voteType: type, commentId, userId })
      if (result.ok) {
        incrHashFields([rediskey.comment.stats(commentId)], "votesAmt", result.data.delta).catch(err => console.error("Failed to update comment vote cache:", err))
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
        incrHashField(rediskey.comment.stats(commentId), "votesAmt", result.data.delta).catch(err => console.error("Failed to update comment vote cache:", err))
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

