import { db } from "@/lib/db"
import { PostValidator } from "@/lib/validators/post"
import { generatePostId } from "@/server/services/Snowflake"
import { VotePost } from "@/server/services/subreddit/action"
import { getPostsWithMeta } from "@/server/services/subreddit/post/service"
import { VoteType } from "@/types/enum"

import { createRoute } from "@/server/lib/createRoute"
import { NextResponse } from "next/server"

export const POST = createRoute({auth: "required",schema: {body: PostValidator},handler: async ({  userId, body :parsed }) => {
    var id= generatePostId()
    await db.$transaction(async (tx) => {
        await tx.post.create({
          data: {
            id: id,
            title: parsed.title,
            content: parsed.content,
            authorId: userId!,
            subredditId: BigInt(parsed.subredditId),
          },
        })
        const results=await tx.mediaImgPost.updateMany({
          where: {
            key: { in: parsed.mediaKeys },
            createdBy: userId,
            postId: null,
            markedForDeletion:false
          },
          data: {
            postId: id,
          },
        })
        if (results.count !== parsed.mediaKeys.length) {
            throw new Error("Some media keys are invalid or already linked")
        }
      })
    await getPostsWithMeta([id],userId)
    await VotePost({type:VoteType.UPVOTE,postId:id,userId:userId!})
    return new NextResponse(JSON.stringify({postId:id}))
},});
