import { redis } from "@/server/lib/redis";
import { getPostsStatByIds } from "./loader";
import { rediskey } from "@/types/rediskey";

export function hotScore(score: number, createdAt: number): number {
    const s = score;
    const order = Math.log10(Math.max(Math.abs(s), 1));
    const sign = s > 0 ? 1 : s < 0 ? -1 : 0;
    const seconds = createdAt / 1000 - 1134028003; 
    const cal =order+ sign* seconds / 45000;
    return Math.round(cal*100000)/100000;
}
  export async function generateDumbRankPosts(ids:bigint[],subredditId:bigint){
    var pipeline = redis.pipeline()
    const key = rediskey.subreddit.hotrank(subredditId)
    for(var id of ids){
      pipeline.zadd(key,0,id.toString())
    }
    await pipeline.exec()
  }
  export async function recomputeAllHotRanks() {
    let cursor = "0";
    do {
      const [nextCursor, keys] = await redis.scan(cursor,"MATCH",rediskey.subreddit.hotrankall,"COUNT",50);
      cursor = nextCursor;
      for (const key of keys) {
        const postIds = await redis.zrange(key, 0, -1);
        if (postIds.length === 0) continue;
        const ids = postIds.map(id => BigInt(id));
        const stats = await getPostsStatByIds(ids);
        const pipeline = redis.pipeline();
        const n=stats.length;
        for(let i=0;i<n;i++) {
          var stat=stats[i]
          var id= ids[i] 
          if(!stat)continue;
          const score = hotScore(stat.votesAmt, stat.date);
          pipeline.zadd(key,score,id.toString());
        }
        await pipeline.exec();
      }
    } while (cursor !== "0");
  }

  export async function recomputeHotRankForSubreddit(subredditId: bigint) {
    const key = rediskey.subreddit.hotrank(subredditId);
    
    const postIds = await redis.zrange(key, 0, -1);
    console.log(postIds)
    if (postIds.length === 0) return;
    const ids = postIds.map(id => BigInt(id));
    const stats = await getPostsStatByIds(ids);
    const pipeline = redis.pipeline();
    const n = stats.length;
    for (let i = 0; i < n; i++) {
      const stat = stats[i];
      const id = ids[i];
      if (!stat) continue;
      const score = hotScore(stat.votesAmt, stat.date);
      pipeline.zadd(key, score, id.toString());
    }
  
    await pipeline.exec();
  }