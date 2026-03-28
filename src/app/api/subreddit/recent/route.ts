
import { getId } from "@/lib/utils";
import { UserSubredditHistory } from "@/lib/validators/user";
import { withAuth } from "@/server/lib/withAuth";
import { withErrorHandler } from "@/server/lib/withErrorHandler";
import { getSubredditsMetadata } from "@/server/services/subreddit/loader";
import { getUserSubredditHistory } from "@/server/services/user/loader";
import { SubRedditDto } from "@/types/subreddit";
import { NextResponse } from "next/server";


export const GET = withErrorHandler(withAuth(async (req: Request, token) => {
      const userId = getId(token)
      const subIds = await getUserSubredditHistory(userId) 
      const subs = await getSubredditsMetadata(subIds)
      return new NextResponse(JSON.stringify({subreddits: subs.map(s =>({...s} as SubRedditDto))} as UserSubredditHistory)) 
      })
    )
  