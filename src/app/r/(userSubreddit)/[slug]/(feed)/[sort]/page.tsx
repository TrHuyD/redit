
import PostFeed from "@/components/ui/post/PostFeed"
import { getAuthToken } from "@/lib/auth"
import { getIdnull } from "@/lib/utils"

import {  getSubredditPosts } from "@/server/services/subreddit/Get"
import { SortBy } from "@/types/enum"

import { notFound } from "next/navigation"
import { SubredditPageInitier } from "../../page"

interface PageProps {
    params: Promise<{
      slug: string,
      sort: SortBy
    }>
  }
  
  export default async function Page({ params }: PageProps) {
    const { slug,sort } = await params
    if (!Object.values(SortBy).includes(sort as SortBy)) {
      notFound();
    }
    return await SubredditPageInitier({slug,sort})
  }