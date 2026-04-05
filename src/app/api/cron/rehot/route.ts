import { recomputeRankForSubreddit } from "@/server/services/subreddit/post/rankhelper";
import { NextRequest, NextResponse } from "next/server";





export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subredditId = BigInt(searchParams.get("subreddit")??0) ;
    const password = searchParams.get("password")|| "";
    if(password!=process.env.NEXTAUTH_SECRET||subredditId===BigInt(0)) return NextResponse.json({ error: "wrong password" }, { status: 500 });
    await recomputeRankForSubreddit(subredditId)
    return NextResponse.json({ message: `Recalculated hot of ${subredditId}.` });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}