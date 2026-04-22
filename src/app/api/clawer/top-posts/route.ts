import { db } from "@/lib/db";
import { cleanImageUrl } from "@/lib/utils";
import { generatePostId, generateUserId } from "@/server/services/Snowflake";
import { createSubreddit } from "@/server/services/subreddit/create";
import { recomputeRankForSubreddit } from "@/server/services/subreddit/post/rankhelper";
import { RedditCommentData, RedditListing, RedditPost, RedditPostResponse, RedditSubredditResponse } from "@/types/reddit";
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
  } catch (e) {}
  return BloomFilter.create(100000, 0.01);
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

async function fetchHotPosts(subreddit: string, limit: number) {
  const res = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}&t=hour`);
  return (await res.json()) as RedditPostResponse;
}

async function fetchSubredditInfo(subreddit: string) {
  const res = await fetch(`https://www.reddit.com/r/${subreddit}/about.json`);
  return (await res.json()) as RedditSubredditResponse;
}

async function ensureSubreddit(subredditName: string) {
  let subreddit = await db.subreddit.findUnique({ where: { name: subredditName } });
  if (subreddit) return subreddit;
  const json = await fetchSubredditInfo(subredditName);
  const created = await createSubreddit({
    name: subredditName,
    userId: BigInt("100000000000000"),
    avatarImage: cleanImageUrl(json.data.community_icon),
    bannerImage: cleanImageUrl(json.data.banner_img || json.data.banner_background_image),
    description: json.data.public_description,
  });
  if (!created.ok) throw new Error(created.error.message);
  return created.data;
}

type RedditPostThreadResponse = [RedditListing<RedditPost>, RedditListing<RedditCommentData>];

async function fetchPostThread(postId: string): Promise<RedditPostThreadResponse> {
  const res = await fetch(`https://www.reddit.com/comments/${postId}.json`);
  return  res.json();
}

export function parsePostThread(raw: RedditPostThreadResponse): {
  post: RedditPost;
  comments: RedditCommentData[];
} {
  const post = raw[0].data.children[0].data;
  const comments = raw[1].data.children.map((c) => c.data);
  return { post, comments };
}

async function fetchFullPost(postId: string) {
  const raw = await fetchPostThread(postId);
  return parsePostThread(raw);
}

function filterNewPosts(posts: any[], bloom: BloomFilter) {
  return posts.filter((p) => !bloom.has(p.id));
}

async function ensureUsers(authors: string[]) {
  const existing = await db.user.findMany({ where: { username: { in: authors } } });
  const existingSet = new Set(existing.map((u) => u.username));
  const newUsers = await Promise.all(
    authors
      .filter((a) => !existingSet.has(a))
      .map(async (username) => ({
        id: generateUserId(),
        name: username,
        username,
        image: await getRedditAvatar(username),
      })),
  );
  await db.user.createMany({ data: newUsers, skipDuplicates: true });
  return db.user.findMany({ where: { username: { in: authors } } });
}

function mapPosts(posts: any[], subredditId: bigint, userMap: Record<string, bigint>) {
  return posts.map((p) => ({
    id: generatePostId(BigInt(p.created_utc * 1000)),
    title: p.title,
    content: { text: p.selftext },
    subredditId,
    authorId: userMap[p.author],
    createdAt: new Date(p.created_utc * 1000),
  }));
}

async function insertPosts(posts: ReturnType<typeof mapPosts>) {
  await db.post.createMany({ data: posts, skipDuplicates: true });
}

async function insertVotes(posts: ReturnType<typeof mapPosts>) {
  const BATCH = 4000;
  const MAX = 20000;
  const base = BigInt("100000000000000");
  for (const post of posts) {
    const count = Math.min(Math.random() * 50 + 50, MAX);
    const votes = Array.from({ length: count }, (_, i) => ({
      type: 1,
      postId: post.id,
      userId: base + BigInt(i),
    }));
    for (let i = 0; i < votes.length; i += BATCH) {
      await db.postVote.createMany({ data: votes.slice(i, i + BATCH), skipDuplicates: true });
    }
  }
}

function flattenComments(comments: RedditCommentData[]): RedditCommentData[] {
  const result: RedditCommentData[] = [];
  for (const top of comments) {
    result.push(top);
    if (top.replies && typeof top.replies !== "string" && top.replies.data?.children) {
      for (const child of top.replies.data.children) {
        if (child.kind === "t1") result.push(child.data as RedditCommentData);
      }
    }
    if(result.length>10)
      break;
  }
  return result;
}
async function createComments(
  posts: ReturnType<typeof mapPosts>,
  fullPosts: Awaited<ReturnType<typeof fetchFullPost>>[],
  userMap: Record<string, bigint>,
) {
  const rows = posts.flatMap((post, i) =>
    flattenComments(fullPosts[i].comments)
      .filter((c) => userMap[c.author])
      .map((c) => ({
        id: generatePostId(BigInt(c.created_utc * 1000)),
        content: { text: c.body },
        postId: post.id,
        authorId: userMap[c.author],
        createdAt: new Date(c.created_utc * 1000),
      })),
  );
  if (!rows.length) return;
  await db.comment.createMany({ data: rows, skipDuplicates: true });
}

async function processSubreddit(subredditName: string, limit: number) {
  const fetchedPost = await fetchHotPosts(subredditName, limit);
  const subreddit = await ensureSubreddit(subredditName);

  const postsData = fetchedPost.data.children.map((p) => p.data);
  const bloom = loadBloomFilter();
  const newPosts = filterNewPosts(postsData, bloom);

  if (!newPosts.length) {
    return { subreddit: subredditName, message: "No new posts to insert." };
  }
  newPosts.forEach((p) => bloom.add(p.id));
  saveBloomFilter(bloom);
  const fullPosts = await Promise.all(newPosts.map((p) => fetchFullPost(p.id)));
  const commentAuthors = fullPosts.flatMap((fp) =>
    flattenComments(fp.comments).map((c) => c.author).filter((a): a is string => typeof a === "string" && a.length > 0),
  );
  const authors = Array.from(new Set([...newPosts.map((p) => p.author), ...commentAuthors]));
  const users = await ensureUsers(authors);
  const userMap = Object.fromEntries(users.map((u) => [u.username, u.id]));

  const posts = mapPosts(newPosts, subreddit.id, userMap);

  await insertPosts(posts);
  await insertVotes(posts);
  await createComments(posts, fullPosts, userMap);
  await recomputeRankForSubreddit(subreddit.id);
  return {
    subreddit: subredditName,
    message: `Inserted ${posts.length} new posts into DB.`,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subredditParam = searchParams.get("subreddit") || "javascript";
    const subredditNames = subredditParam.split(",").map((s) => s.trim().toLowerCase());
    const limit = Math.min(parseInt(searchParams.get("limit") || "5"), 20);
    const password = searchParams.get("password") || "";
    if (password !== process.env.NEXTAUTH_SECRET) {
      return NextResponse.json({ error: "wrong password" }, { status: 500 });
    }
    const results = [];

    for (const name of subredditNames) {
      try {
        results.push(await processSubreddit(name, limit));
      } catch (e: any) {
        results.push({ subreddit: name, message: `Error: ${e.message}` });
      }
    }

    return NextResponse.json({ results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}