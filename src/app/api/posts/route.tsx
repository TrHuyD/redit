import { getAuthToken } from "@/lib/auth";

import { getIdnull } from "@/lib/utils";
import { SubredditPostRetrieveValidator } from "@/lib/validators/post";
import { withErrorHandler } from "@/server/lib/withErrorHandler";
import { getSubredditPosts } from "@/server/services/subreddit/Get";
import { NextRequest } from "next/server";



export  const GET =  withErrorHandler( async(req: NextRequest)  =>{
    try {
        const { searchParams } = req.nextUrl
        const raw = Object.fromEntries(searchParams)
        const parsed = SubredditPostRetrieveValidator.parse(raw)
        const userId = getIdnull(await getAuthToken())
        const posts = await getSubredditPosts({slug:parsed.subredditName,take:parsed.limit,cursor:parsed.cursorId,userId:userId})
        return new Response(
            JSON.stringify(posts, (_, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        )

    } catch (error) {
        return new Response('Internal Server Error', { status: 500 })
    }
})