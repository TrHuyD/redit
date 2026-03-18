
import PostFeed from "@/components/ui/post/PostFeed"
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { getSubreddit } from "@/lib/api/Subreddit/GetSubreddit"
import { getAuthToken } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{
      slug: string
    }>
  }
  
  export default async function Page({ params }: PageProps) {
    const { slug } = await params
    // const subreddit = await getSubreddit(slug)
    const subreddit = await db.subreddit.findFirst({
      where: { name: slug },
      include: {
        posts: {
          include: {
            author: true,
            votes: true,
            comments: true,
            subreddit: true,
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: INFINITE_SCROLLING_PAGINATION_RESULTS,
        },
      },
    })
    if(!subreddit)
        return notFound()
    return (
      <PostFeed initialPosts={subreddit.posts} subredditName={slug}/>
    )
    
  }