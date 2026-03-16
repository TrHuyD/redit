import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { db } from "@/lib/db"
import { SubredditWithMembership } from "@/types/subreddit"
import { cache } from "react"
import { notFound } from "next/navigation"


export const getSubreddit = cache(async (slug: string) => {
  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
  })

  if (!subreddit) notFound()
  return subreddit
})

export async function getSubredditWithMembership(slug: string, userId?: string) {
  const subreddit = await getSubreddit(slug)
  var membership =!userId?null: await db.subscription.findFirst({
    where: {
      subredditId: subreddit.id,
      userId,
    },
  })

  return {
    ...subreddit,
    isMember: !!membership,
    isCreator: subreddit.creatorId === userId,
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
