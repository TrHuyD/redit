import { redis } from "@/server/lib/redis";
import { rediskey } from "@/types/rediskey";

export function hotScore(score: number, createdAt: number): number {
    const s = score;
    const order = Math.log10(Math.max(Math.abs(s), 1));
    const sign = s > 0 ? 1 : s < 0 ? -1 : 0;
    const seconds = createdAt / 1000 - 1134028003; 
    const cal =order*sign+ seconds / 45000;
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

