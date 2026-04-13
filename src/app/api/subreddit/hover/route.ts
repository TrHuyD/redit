import { SubredditIdValidator } from "@/lib/validators/subreddit";
import { createRoute } from "@/server/lib/createRoute";
import { getSubredditCompleteMd} from "@/server/services/subreddit/loader";
import { NextResponse } from "next/server";

export const GET = createRoute({auth: "none",schema: {query: SubredditIdValidator},handler: async ({query }) => {
    const output =await getSubredditCompleteMd(query.subredditId)
    if (!output) 
        return NextResponse.json({ error: "subreddit not found" }, { status: 404 });
    return new NextResponse(JSON.stringify(output))
},});