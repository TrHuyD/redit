
import PostFeed from "@/components/ui/post/PostFeed"

import {  getSubredditPosts } from "@/server/services/subreddit/Get"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{
      slug: string
    }>
  }
  
  export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const posts =await getSubredditPosts(slug)
    if(!posts)
        return notFound()
    return (
      <PostFeed initialPosts={posts} subredditName="slug" />
    )
    
  }