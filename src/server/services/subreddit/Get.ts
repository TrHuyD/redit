import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { db } from "@/lib/db"

import { cache } from "react"
import { notFound } from "next/navigation"
import { ID } from "@/types/ID"
import { toPostDto } from "@/types/toDTO"

export const getSubredditMemberCount = cache(async (subId: ID) => {
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
export async function getSubredditWithMembership(slug: string, userId?: ID) {
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

export async function getSubredditPosts({
  slug,
  orderBy = "desc",
  take = INFINITE_SCROLLING_PAGINATION_RESULTS,
  cursor,
  userId,
}: {
  slug: string
  orderBy?: "asc" | "desc"
  take?: number
  cursor?: bigint | number 
  userId?: ID
}) {
  const subreddit = await getSubreddit(slug)
  if (!subreddit) return null
  const _posts = await db.post.findMany({
    where: { subredditId: subreddit.id },
    include: {
      author: true,
      votes: true,
      comments: true,
    },
    orderBy: { id: orderBy },
    take :take,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
  })

  const posts = _posts.map(post => ({
    ...post,
    subreddit,
  }))

  return posts.map(a => toPostDto(a, userId))
}
  
  
  
  
