import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { db } from "@/lib/db"
import { SubredditWithMembership } from "@/types/subreddit"
import { Subreddit } from "@prisma/client"
import { notFound } from "next/navigation"

// export async function getSubreddit(slug: string): Promise<Subreddit>
export async function getSubreddit(slug: string, userId?: string ): Promise<SubredditWithMembership>

export async function getSubreddit(slug: string, userId?: string) {
  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
  })
  if (!subreddit) notFound()

  if (!userId) {
    return subreddit
  }

  const membership = await db.subscription.findFirst({
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
