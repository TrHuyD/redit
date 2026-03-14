import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

export async function getSubreddit(slug: string) {
  const subreddit = await db.subreddit.findFirst({
    where: { name: slug }
  })

  if (!subreddit) notFound()

  return subreddit
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
          
  
  