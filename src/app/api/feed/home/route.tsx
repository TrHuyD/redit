import { getId } from "@/lib/utils"
import { FeedRetrieveValidator } from "@/lib/validators/post"
import { withAuth } from "@/server/lib/withAuth"
import { withErrorHandler } from "@/server/lib/withErrorHandler"
import { getFeedPosts } from "@/server/services/subreddit/post/service"
import { NextRequest } from "next/server"

export  const GET =  withErrorHandler( withAuth(async (req: NextRequest,token)  =>{
    try {
        const { searchParams } = req.nextUrl
        const raw = Object.fromEntries(searchParams)
        const parsed = FeedRetrieveValidator.parse(raw)
        const userId = getId(token)
        const posts = await getFeedPosts({take:parsed.limit,cursor:parsed.cursorId,userId:userId})
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
}))