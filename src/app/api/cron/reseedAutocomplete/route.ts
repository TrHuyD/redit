
import { seedSubredditAutocomplete } from "@/server/services/subreddit/loader";
import { NextRequest, NextResponse } from "next/server";





export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const password = searchParams.get("password")|| "";
    if(password!=process.env.NEXTAUTH_SECRET) return NextResponse.json({ error: "wrong password" }, { status: 500 });
    await seedSubredditAutocomplete()
    return NextResponse.json({ message: `seed complete` });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}