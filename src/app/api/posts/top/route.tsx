import { getAuthToken } from "@/lib/auth";

import { getIdnull } from "@/lib/utils";
import { SubredditPostRetrieveValidator } from "@/lib/validators/post";
import { withErrorHandler } from "@/server/lib/withErrorHandler";
import { getSubredditTopPosts } from "@/server/services/subreddit/post/service";
import { NextRequest, NextResponse } from "next/server";



export  const GET =  withErrorHandler( async(req: NextRequest)  =>{
    try {
        const { searchParams } = req.nextUrl
        const raw = Object.fromEntries(searchParams)
        const parsed = SubredditPostRetrieveValidator.parse(raw)
        const userId = getIdnull(await getAuthToken())
        const posts = await getSubredditTopPosts({slug:parsed.subredditName,take:parsed.limit,cursor:parsed.cursorId,userId:userId})
        return new NextResponse(JSON.stringify(posts?.posts) )
    } catch (error) {
        return new Response('Internal Server Error', { status: 500 })
    }
})