import { db } from "@/lib/db"
import { PostValidator } from "@/lib/validators/post"
import { withAuth } from "@/server/lib/withAuth"
import { withErrorHandler } from "@/server/lib/withErrorHandler"
import { NextRequest } from "next/server"

export const POST = withErrorHandler(withAuth(async (req: NextRequest, token) => {
    const body = await req.json()
    const { title, content, subredditId } = PostValidator.parse(body)
    const userId = token.id
    //check if user is banned from subreddit
    //nothing
    //nothing
    
    //create post
    await db.post.create({
        data: {
            title,
            content,
            authorId: userId,
            subredditId,
        }
    })
    return new Response("Post created", { status: 200 })
}))
