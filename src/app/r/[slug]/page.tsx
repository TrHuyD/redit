
import PostFeed from "@/components/ui/post/PostFeed"
import { getAuthToken } from "@/lib/auth"
import { getIdnull } from "@/lib/utils"

import {  getSubredditPosts } from "@/server/services/subreddit/Get"

import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{
      slug: string,
    }>
  }
  
  export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const token = await getAuthToken()
    const userId = getIdnull(token)
    const posts =await getSubredditPosts({slug, userId:userId})
    if(!posts)
        return notFound()
    return (
      <PostFeed initialPosts={posts} subredditName={slug} />
    )
    
  }