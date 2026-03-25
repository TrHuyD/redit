import { db } from "@/lib/db";
import { SubredditBaseMd } from "@/types/dto";

async function getSubreddits(
    ids: bigint[]
  ): Promise<SubredditBaseMd[]> {
    const rows = await db.subreddit.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true ,
        name: true,
        image: true,
      },
    });
    return rows.map(r => ({
      Id:r.id,
      image:r.image??"",
      name: r.name,
      v: 0n, 
    }));
  }


export async function getSubreddit(serverId:bigint){

}