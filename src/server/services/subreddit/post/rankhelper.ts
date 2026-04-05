import { redis } from "@/server/lib/redis";
import { rediskey } from "@/types/rediskey";
import { hotScore } from "./hotscore";
import { getPostsStatByIds } from "./loader";
import { db } from "@/lib/db";


export async function recomputeRankForSubreddit(subredditId: bigint) {
  const hotkey = rediskey.subreddit.hotrank(subredditId);
  const topkey = rediskey.subreddit.toprank(subredditId);
  const postIds = await db.post.findMany({select:{id:true},where:{subredditId:subredditId}})
  if (postIds.length === 0) return;
  const ids = postIds.map(p=>p.id);
  const stats = await getPostsStatByIds(ids);
  const pipeline = redis.pipeline();
  const n = stats.length;
  for (let i = 0; i < n; i++) {
    const stat = stats[i];
    const id = ids[i].toString();
    if (!stat) continue;
    const score = hotScore(stat.votesAmt, stat.date);
    pipeline.zadd(hotkey, score, id);
    pipeline.zadd(topkey,stat.votesAmt,id)
  }

  await pipeline.exec();
}

export async function recomputeAllRanks() {
  let cursor = "0";
  do {
    const [nextCursor, keys] = await redis.scan(cursor, "MATCH", rediskey.subreddit.hotrankall, "COUNT", 50);
    cursor = nextCursor;
    for (const key of keys) {
      const postIds = await redis.zrange(key, 0, -1);
      if (postIds.length === 0) continue;
      const ids = postIds.map(id => BigInt(id));
      const stats = await getPostsStatByIds(ids);
      const pipeline = redis.pipeline();
      const n = stats.length;
      for (let i = 0; i < n; i++) {
        var stat = stats[i];
        var id = ids[i];
        if (!stat) continue;
        const score = hotScore(stat.votesAmt, stat.date);
        pipeline.zadd(key, score, id.toString());
      }
      await pipeline.exec();
    }
  } while (cursor !== "0");
}

