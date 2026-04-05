// app/api/fetch-top-posts/route.ts
import { db } from "@/lib/db";
import { generatePostId, generateUserId, generateSubredditId } from "@/server/services/Snowflake";
import { createSubreddit } from "@/server/services/subreddit/create";
import { generateDumbRankPosts } from "@/server/services/subreddit/post/hotscore";
import { recomputeRankForSubreddit } from "@/server/services/subreddit/post/rankhelper";
import { NextRequest, NextResponse } from "next/server";

interface RedditPost {
  title: string;
  selftext: string;
  ups: number;
  author: string;
  id: string;
}

interface RedditApiResponse {
  data: {
    children: { data: RedditPost }[];
  };
}

async function getRedditAvatar(username: string): Promise<string> {
  try {
    const res = await fetch(`https://www.reddit.com/user/${username}/about.json`);
    const json = await res.json();
    return json?.data?.icon_img || "https://cdn.discordapp.com/embed/avatars/4.png";
  } catch {
    return "https://cdn.discordapp.com/embed/avatars/4.png";
  }
}


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subredditName = searchParams.get("subreddit") || "javascript";
    const limit = Math.min(parseInt(searchParams.get("limit") || "5"),20);
    const password = searchParams.get("password")|| "";
    if(password!=process.env.NEXTAUTH_SECRET) return NextResponse.json({ error: "wrong password" }, { status: 500 });
    const redditRes = await fetch(
      `https://www.reddit.com/r/${subredditName}/hot.json?limit=${limit}&t=hour`
    );
    const redditJson: RedditApiResponse = await redditRes.json();
    let subreddit = await db.subreddit.findUnique({ where: { name: subredditName } });
    if (!subreddit) {
      const createSubRe = (await createSubreddit({name:subredditName, userId:BigInt("100000000000000")}));
      if(createSubRe.ok)
        subreddit=createSubRe.data
        else return NextResponse.json({ error: createSubRe.error }, { status: 500 });
    }

    const postsData = redditJson.data.children.map((p) => p.data);
    const uniqueAuthors = Array.from(new Set(postsData.map((p) => p.author)));
    const existingUsers = await db.user.findMany({
      where: { username: { in: uniqueAuthors } },
    });
    const existingUsernames = new Set(existingUsers.map((u) => u.username));
    const newUsers = await Promise.all(
      uniqueAuthors
        .filter((u) => !existingUsernames.has(u))
        .map(async (username) => ({
          id: generateUserId(),
          name: username,
          username,
          image: await getRedditAvatar(username),
        }))
    );

    await db.user.createMany({ data: newUsers, skipDuplicates: true });
    const allUsers = await db.user.findMany({ where: { username: { in: uniqueAuthors } } });
    const usernameToId = Object.fromEntries(allUsers.map((u) => [u.username, u.id]));
    const postsToInsert = postsData.map((p) => ({
      id: generatePostId(),
      title: p.title,
      content: { text: p.selftext },
      subredditId: subreddit.id,
      authorId: usernameToId[p.author],
    }));
    await db.post.createMany({ data: postsToInsert, skipDuplicates: true });
    const VOTE_BATCH_SIZE = 1000;
    const MAX_VOTES = 20000;
    const voteBaseId = BigInt("100000000000000");
    for (let i = 0; i < postsToInsert.length; i++) {
      const post = postsToInsert[i];
      const voteCount = Math.min(Math.random()*10000, MAX_VOTES);
      const allVotes = Array.from({ length: voteCount }, (_, j) => ({
          type: 1, 
          postId: post.id,
          userId: voteBaseId + BigInt(j), 
      }));
      for (let b = 0; b < allVotes.length; b += VOTE_BATCH_SIZE) {
          const batch = allVotes.slice(b, b + VOTE_BATCH_SIZE);
          await db.postVote.createMany({ data: batch, skipDuplicates: true });
      }
    }
    await generateDumbRankPosts(postsToInsert.map(p =>p.id),subreddit.id)
    await recomputeRankForSubreddit(subreddit.id)
    return NextResponse.json({ message: `Inserted ${postsToInsert.length} posts into DB.` });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}