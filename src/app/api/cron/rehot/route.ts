// app/api/fetch-top-posts/route.ts
import { db } from "@/lib/db";
import { generatePostId, generateUserId, generateSubredditId } from "@/server/services/Snowflake";
import { createSubreddit } from "@/server/services/subreddit/create";
import { generateDumbRankPosts, recomputeHotRankForSubreddit } from "@/server/services/subreddit/post/hotscore";
import { NextRequest, NextResponse } from "next/server";





export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subredditId = BigInt(searchParams.get("subreddit")??0) ;
    const password = searchParams.get("password")|| "";
    if(password!=process.env.NEXTAUTH_SECRET||subredditId===BigInt(0)) return NextResponse.json({ error: "wrong password" }, { status: 500 });
    await recomputeHotRankForSubreddit(subredditId)
    return NextResponse.json({ message: `Recalculated hot of ${subredditId}.` });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}