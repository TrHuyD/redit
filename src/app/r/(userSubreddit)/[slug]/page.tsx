
import SortBar from "@/components/SortBar"
import PostFeed from "@/components/ui/post/PostFeed"
import { getAuthToken } from "@/lib/auth"
import { getIdnull } from "@/lib/utils"
import { MarkVisit } from "@/server/services/subreddit/action"

import {  getSubredditHotPosts, getSubredditPosts, getSubredditTopPosts } from "@/server/services/subreddit/post/service"
import { SortBy } from "@/types/enum"

import { notFound } from "next/navigation"

  interface PageProps {
      params: Promise<{
        slug: string,
      }>
    }
  
  export default async function Page({ params }: PageProps) {
    const { slug } = await params
    return await SubredditPageInitier({slug})
  }
  export async function SubredditPageInitier({slug,sort=SortBy.NEW}:{slug:string,sort?:SortBy}){
    const token = await getAuthToken()
    const userId = getIdnull(token)
    let posts
    switch(sort){
    case SortBy.HOT:posts = await getSubredditHotPosts({slug,userId}); break;
    case SortBy.TOP:posts = await getSubredditTopPosts({slug,userId});break;
    default: posts =await getSubredditPosts({slug, userId:userId});break;
    }
    if(!posts)
        return notFound()
    if(userId)
    {   
       MarkVisit({subredditId:posts.subId,userId:userId}).catch(err =>{ console.error("Failed to register visit:", err);})
    }
    return (
      <div>
      <SortBar subredditId={slug} currentSort={sort}/>
      <PostFeed initialPosts={posts.posts} subredditName={slug} sortBy={sort}/>
      </div>
    )
  }