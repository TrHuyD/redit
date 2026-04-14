// app/api/fetch-top-posts/route.ts
import { db } from "@/lib/db";
import { cleanImageUrl } from "@/lib/utils";
import { generatePostId, generateUserId } from "@/server/services/Snowflake";
import { createSubreddit } from "@/server/services/subreddit/create";
import { recomputeRankForSubreddit } from "@/server/services/subreddit/post/rankhelper";
import { RedditPostResponse, RedditSubredditResponse } from "@/types/reddit";
import { BloomFilter } from "bloom-filters";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";


const BLOOM_FILE = path.join(process.cwd(), "bloom_posts.json");
function loadBloomFilter(): BloomFilter {
  try {
    if (fs.existsSync(BLOOM_FILE)) {
      const data = JSON.parse(fs.readFileSync(BLOOM_FILE, "utf-8"));
      return BloomFilter.fromJSON(data);
    }
  } catch (e) {
    console.error("Failed to load bloom filter, creating new one.", e);
  }
  return BloomFilter.create(100_000, 0.01);
}
  function saveBloomFilter(filter: BloomFilter) {
  fs.writeFileSync(BLOOM_FILE, JSON.stringify(filter.saveAsJSON()));
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
    const subredditParam = searchParams.get("subreddit") || "javascript";
    const subredditNames = subredditParam.split(",").map((s) => s.trim().toLocaleLowerCase());
    const limit = Math.min(parseInt(searchParams.get("limit") || "5"), 20);
    const password = searchParams.get("password") || "";
    if (password != process.env.NEXTAUTH_SECRET)
      return NextResponse.json({ error: "wrong password" }, { status: 500 });

    const results: { subreddit: string; message: string }[] = [];

    for (const subredditName of subredditNames) {
      const redditRes = await fetch(`https://www.reddit.com/r/${subredditName}/hot.json?limit=${limit}&t=hour`);
      const redditJson: RedditPostResponse = await redditRes.json();
      let subreddit = await db.subreddit.findUnique({ where: { name: subredditName } });
      if (!subreddit) {
        const subredditRes = await fetch(`https://www.reddit.com/r/${subredditName}/about.json`)
        const subredditJson: RedditSubredditResponse = await subredditRes.json()
        const createSubRe = await createSubreddit({
          name: subredditName, userId: BigInt("100000000000000"),
          avatarImage: cleanImageUrl(subredditJson.data.community_icon),
          bannerImage: cleanImageUrl(subredditJson.data.banner_img || subredditJson.data.banner_background_image),
          description: subredditJson.data.public_description
        });

        if (createSubRe.ok) subreddit = createSubRe.data;
        else {
          results.push({ subreddit: subredditName, message: `Error: ${createSubRe.error}` });
          continue;
        }
      }

      const postsData = redditJson.data.children.map((p) => p.data);
      const bloom = loadBloomFilter();
      const newPosts = postsData.filter((p) => !bloom.has(p.id));
      if (newPosts.length === 0) {
        results.push({ subreddit: subredditName, message: "No new posts to insert." });
        continue;
      }
      newPosts.forEach((p) => bloom.add(p.id));
      saveBloomFilter(bloom);
      const uniqueAuthors = Array.from(new Set(newPosts.map((p) => p.author)));
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
      const postsToInsert = newPosts.map((p) => ({
        id: generatePostId(BigInt(p.created_utc * 1000)),
        title: p.title,
        content: { text: p.selftext },
        subredditId: subreddit.id,
        authorId: usernameToId[p.author],
        createdAt: new Date(p.created_utc * 1000)
      }));
      await db.post.createMany({ data: postsToInsert, skipDuplicates: true });
      const VOTE_BATCH_SIZE = 4000;
      const MAX_VOTES = 20000;
      const voteBaseId = BigInt("100000000000000");
      for (let i = 0; i < postsToInsert.length; i++) {
        const post = postsToInsert[i];
        const voteCount = Math.min(Math.random() * 50 + 50, MAX_VOTES);
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
      await recomputeRankForSubreddit(subreddit.id);
      results.push({ subreddit: subredditName, message: `Inserted ${postsToInsert.length} new posts into DB.` });
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}