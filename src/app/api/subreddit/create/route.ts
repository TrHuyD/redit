import { withAuth } from "@/server/lib/withAuth"
import { withErrorHandler } from "@/server/lib/withErrorHandler"
import { SubredditValidator } from "@/lib/validators/subreddit"
import { createSubreddit } from "@/server/services/subreddit/create"
import { NextRequest } from "next/server"

export const POST = withErrorHandler(withAuth(async (req: NextRequest, token) => {
    const body = await req.json()
    const { name } = SubredditValidator.parse(body)

    const userId = token.id

    const result = await createSubreddit({ name, userId })

    if (result.ok) {
      return new Response(name, { status: 200 })
    }

    if (result.error === "SUBREDDIT_EXISTS") {
      return Response.json({ error: "Subreddit already exists" }, { status: 400 })
    }

    return Response.json({ error: "Internal error" }, { status: 500 })
  })
)