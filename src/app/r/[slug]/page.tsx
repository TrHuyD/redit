import MiniCreatePost from "@/components/post/minicreatepost"
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{
      slug: string
    }>
  }
  
  export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const session= await getAuthSession()
    const subreddit = await db.subreddit.findUnique({
      where: {
        name: slug,
      },
      include: {
        posts: {
          include: {
            author: true,
            votes: true,
            comments: true,
            subreddit: true,
          },
        take  : INFINITE_SCROLLING_PAGINATION_RESULTS
    }}})
    if (!subreddit) return notFound()
    return <>
      <h1 className='font-bold text-3xl md:text-4xl h-14'>
        r/{subreddit.name}
      </h1>
       <MiniCreatePost session={session} />
      
    </>
  }