import { db } from "@/lib/db"
import { getId } from "@/lib/utils"
import { PostValidator } from "@/lib/validators/post"
import { withAuth } from "@/server/lib/withAuth"
import { withErrorHandler } from "@/server/lib/withErrorHandler"
import { generatePostId } from "@/server/services/Snowflake"
import { VotePost } from "@/server/services/subreddit/action"
import { getPostsWithMeta } from "@/server/services/subreddit/post/service"
import { VoteType } from "@/types/enum"

import {  NextRequest, NextResponse } from "next/server"

export const POST = withErrorHandler(withAuth(async (req: NextRequest, token) => {
    const body = await req.json()
    const { title, content, subredditId } = PostValidator.parse(body)
    const userId = getId(token)
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
    await getPostsWithMeta([id],userId)
    await VotePost({type:VoteType.UPVOTE,postId:id,userId:userId})
    return NextResponse.json({postId:id})
}))
