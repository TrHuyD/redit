import { FeedRetrieveValidator } from "@/lib/validators/post";
import { createRoute } from "@/server/lib/createRoute";
import { getFeedPosts } from "@/server/services/subreddit/post/service";
import { NextResponse } from "next/server";

export const GET = createRoute({auth: "required",schema: {query: FeedRetrieveValidator,},handler: async ({  userId,  query:parsed }) => {
    const posts = await getFeedPosts({take:parsed.limit,cursor:parsed.cursorId,userId:userId!})
    return new NextResponse(JSON.stringify(posts))
},});
