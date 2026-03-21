import { withAuth } from "@/server/lib/withAuth"
import { withErrorHandler } from "@/server/lib/withErrorHandler"
import { SubredditValidator } from "@/lib/validators/subreddit"
import { createSubreddit } from "@/server/services/subreddit/create"
import { NextRequest } from "next/server"
import { getId } from "@/lib/utils"

export const POST = withErrorHandler(withAuth(async (req: NextRequest, token) => {
    const body = await req.json()
    const { name } = SubredditValidator.parse(body)
  
    const userId = getId(token)

    const result = await createSubreddit({ name, userId })

    if (result.ok) {
      return new Response(name, { status: 200 })
    }

    if (result.error.message === "SUBREDDIT_EXISTS") {
      return Response.json({ error: `Subreddit ${name} already exists` }, { status: 400 })
    }

    return Response.json({ error: "Internal error" }, { status: 500 })
  })
)