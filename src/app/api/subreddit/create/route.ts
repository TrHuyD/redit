import { withAuth } from "@/server/lib/withAuth"
import { withErrorHandler } from "@/server/lib/withErrorHandler"
import { SubredditValidator } from "@/lib/validators/subreddit"
import { getAuthSession } from "@/lib/auth"
import { createSubreddit } from "@/server/services/subreddit/create"
export const POST = withErrorHandler(withAuth(async (req: Request) => {
    const body = await req.json()
    const {name}  = SubredditValidator.parse(body)
    const session = await getAuthSession()
    const userId = session?.user.id as string
    const result = await createSubreddit({ name, userId })
    console.log(result)
    if(result.ok){
        return new Response(name,{ status: 200 })
    }
    else
    {
       
        if(result.error === "SUBREDDIT_EXISTS"){
            return Response.json({ error:"Subreddit already exists" }, { status: 400 })
        }
        else
        {
            return  Response.json({ error:"Internal error" }, { status: 500 })
        }
    }
}
))