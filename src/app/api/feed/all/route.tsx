import { getAuthToken } from "@/lib/auth"
import { getIdnull } from "@/lib/utils"
import { FeedRetrieveValidator } from "@/lib/validators/post"
import { withErrorHandler } from "@/server/lib/withErrorHandler"
import { getAllPosts } from "@/server/services/subreddit/post/service"
import { NextRequest } from "next/server"

export  const GET =  withErrorHandler( async (req: NextRequest)  =>{
    try {
        const { searchParams } = req.nextUrl
        const raw = Object.fromEntries(searchParams)
        const parsed = FeedRetrieveValidator.parse(raw)
        const userId = getIdnull(await getAuthToken())
        const posts = await getAllPosts({take:parsed.limit,cursor:parsed.cursorId,userId:userId})
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