import { withErrorHandler } from '@/server/lib/withErrorHandler';

import { NextRequest, NextResponse } from "next/server"
import { UnVotePost, VotePost } from "@/server/services/subreddit/action";
import { VoteType } from "@/types/enum";
import { withAuth } from '@/server/lib/withAuth';
import { getId } from '@/lib/utils';

function getRandomVoteType(){
  const rand = Math.random()
  if (rand < 0.33) return VoteType.DOWNVOTE
  if (rand < 0.66) return VoteType.UPVOTE
  return "NONE"
}

// simulate random user ids
function randomUserId(i: number) {
  return `benchmark-user-${i}`
}

export const GET =withErrorHandler(withAuth (async(req: NextRequest,token) => {
  const { searchParams } = new URL(req.url)

  const postId = BigInt(searchParams.get("id")!)
  const clientCount = Number(searchParams.get("client") || 10)
  const userId = getId(token)
  if (!postId) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  const start = Date.now()

  const tasks = Array.from({ length: clientCount }).map((_, i) => {
    const type = getRandomVoteType()

    if (type === "NONE") {
      return UnVotePost({
        postId,
        userId,
      })
    }

    return VotePost({
      type,
      postId,
      userId,
    })
  })

  // run all concurrently
  const results = await Promise.allSettled(tasks)

  const end = Date.now()

  const success = results.filter(r => r.status === "fulfilled").length
  const failed = results.filter(r => r.status === "rejected").length

  return NextResponse.json({
    commentId: postId,
    clients: clientCount,
    durationMs: end - start,
    success,
    failed,
    throughput: (clientCount / ((end - start) / 1000)).toFixed(2) + " req/s",
  })
}))