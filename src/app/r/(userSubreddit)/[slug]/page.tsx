
import PostFeed from "@/components/ui/post/PostFeed"
import { getAuthToken } from "@/lib/auth"
import { getIdnull } from "@/lib/utils"
import { MarkVisit } from "@/server/services/subreddit/action"

import {  getSubredditPosts } from "@/server/services/subreddit/post/service"
import { SortBy } from "@/types/enum"

import { notFound } from "next/navigation"

  interface PageProps {
      params: Promise<{
        slug: string,
      }>
    }
  
  export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const sort = SortBy.NEW
    const token = await getAuthToken()
    const userId = getIdnull(token)
    const posts =await getSubredditPosts({slug, userId:userId})

    if(!posts)
        return notFound()
    if(userId)
    {   
       MarkVisit({subredditId:posts.subId,userId:userId}).catch(err =>{ console.error("Failed to register visit:", err);})
    }
    return (
      <PostFeed initialPosts={posts.posts} subredditName={slug} />
    )
    
  }