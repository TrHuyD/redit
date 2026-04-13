import { withAuth } from "@/server/lib/withAuth"
import { withErrorHandler } from "@/server/lib/withErrorHandler"
import { SubredditIdValidator } from "@/lib/validators/subreddit"
import { NextRequest } from "next/server"
import { JoinSubreddit } from "@/server/services/subreddit/action"
import { getId } from "@/lib/utils"

export const POST = withErrorHandler(withAuth(async (req: NextRequest, token) => {
    const body = await req.json()
    const { subredditId :name } = SubredditIdValidator.parse(body)
    const userId = getId(token)
    const result = await JoinSubreddit({ subredditId: name, userId })
    if (!result.ok&&result.error.code!="409" ) {
        return Response.json({error :result}, {status: 400 })}
    return new Response("ok", { status: 200 }) 

}))
