
import { SubredditPostRetrieveValidator } from "@/lib/validators/post";
import { createRoute } from "@/server/lib/createRoute";
import { getSubredditPosts } from "@/server/services/subreddit/post/service";
import { NextResponse } from "next/server";

export const GET = createRoute({auth: "optional",schema: {query: SubredditPostRetrieveValidator,},handler: async ({ userId, query:parsed }) => {
    const posts = await getSubredditPosts({slug:parsed.subredditName,take:parsed.limit,cursor:parsed.cursorId,userId:userId})
    return new NextResponse(JSON.stringify(posts?.posts))
},});