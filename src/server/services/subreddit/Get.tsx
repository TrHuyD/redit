import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { db } from "@/lib/db"

import { cache } from "react"
import { notFound } from "next/navigation"

export const getSubredditMemberCount = cache(async (subId: string) => {
  const count = await db.subscription.count({
    where: {
      subredditId: subId,
    },
  })
  return count
})

export const getSubreddit = cache(async (slug: string) => {
  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
  })

  if (!subreddit) notFound()
  return subreddit
})
export const getSubredditManifestedMetadata = cache(async (slug: string) => {
  const subreddit = await getSubreddit(slug)
  var memberCount = await getSubredditMemberCount(subreddit.id)
  return {
    ...subreddit,
    userCount: memberCount
  }
})
export async function getSubredditWithMembership(slug: string, userId?: string) {
  var metadata = await getSubredditManifestedMetadata(slug)
  var membership =!userId?null: await db.subscription.findUnique({
    where: {userId_subredditId: {
      subredditId: metadata.id,
      userId,
     } },
  })

  return {
    ...metadata,
    isMember: !!membership,
    isCreator: metadata.creatorId === userId,
  }
}

export async function getSubredditPosts(slug: string,orderBy: "asc" | "desc" = "desc",take: number = INFINITE_SCROLLING_PAGINATION_RESULTS) {   
    return db.post.findMany({
      where: {
        subreddit: { name: slug }
      },
      include: {
        author: true,
        votes: true,
        comments: true,
        subreddit: true,
      },
      orderBy: { createdAt: orderBy },
      take  : take
    })
  }
