import { withAuth } from "@/server/lib/withAuth"
import { withErrorHandler } from "@/server/lib/withErrorHandler"
import { SubredditValidator } from "@/lib/validators/subreddit"
import { NextRequest } from "next/server"
import { JoinSubreddit } from "@/server/services/subreddit/join"

export const POST = withErrorHandler(withAuth(async (req: NextRequest, token) => {
    const body = await req.json()
    const { name } = SubredditValidator.parse(body)
    const userId = token.id
    const result = await JoinSubreddit({ subredditId: name, userId })
    if (!result.ok) { return Response.json({error :result.error}, {status: 400 })}
    return new Response("ok", { status: 200 }) 

}))
