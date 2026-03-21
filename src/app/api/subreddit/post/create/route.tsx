import { db } from "@/lib/db"
import { getId } from "@/lib/utils"
import { PostValidator } from "@/lib/validators/post"
import { withAuth } from "@/server/lib/withAuth"
import { withErrorHandler } from "@/server/lib/withErrorHandler"
import { generatePostId } from "@/server/services/Snowflake"
import { getToken } from "next-auth/jwt"
import { JWT } from "next-auth/jwt/types"
import { NextRequest } from "next/server"

export const POST = withErrorHandler(withAuth(async (req: NextRequest, token) => {
    const body = await req.json()
    const { title, content, subredditId } = PostValidator.parse(body)
    const userId = getId(token)
    //check if user is banned from subreddit
    //nothing
    //nothing
    
    //create post
    var id= generatePostId()
    await db.post.create({
        data: {
            id:id,
            title,
            content,
            authorId: userId,
            subredditId: BigInt(subredditId),
        }
    })
    return new Response("Post created", { status: 200 })
}))
