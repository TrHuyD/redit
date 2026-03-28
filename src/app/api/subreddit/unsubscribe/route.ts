import { withAuth } from "@/server/lib/withAuth"
import { withErrorHandler } from "@/server/lib/withErrorHandler"
import {  SubscriptionValidator } from "@/lib/validators/subreddit"
import { NextRequest } from "next/server"
import { LeaveSubreddit } from "@/server/services/subreddit/action"
import { getId } from "@/lib/utils"

export const POST = withErrorHandler(withAuth(async (req: NextRequest, token) => {
    const body = await req.json()
    const {subredditId: name } = SubscriptionValidator.parse(body)
    const userId = getId(token)
    const result = await LeaveSubreddit({ subredditId: name, userId })
    if (!result.ok) { return Response.json({error :result.error}, {status: 400 })}
    return new Response("ok", { status: 200 }) 
}))
