import { FeedRetrieveValidator } from "@/lib/validators/post";
import { createRoute } from "@/server/lib/createRoute";
import { getAllPosts } from "@/server/services/subreddit/post/service";
import { NextResponse } from "next/server";

export const GET =  createRoute({auth: "optional",schema: {query: FeedRetrieveValidator,},handler: async ({userId,  query:parsed }) => {
    const posts = await getAllPosts({take:parsed.limit,cursor:parsed.cursorId,userId:userId})
    return new NextResponse(JSON.stringify(posts))
},});

