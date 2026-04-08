import { db } from "@/lib/db";
import { SubredditBaseMd, SubredditMinimalMd ,subredditMemCount} from "@/types/subreddit";


export async function getSubreddits(ids: bigint[]): Promise<SubredditBaseMd[]> {

    const rows = await db.subreddit.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true ,
        name: true,
        image: true,
        createdAt:true,
        latestUpdateAt:true,
        creatorId:true,
        bannerImage:true
      },
    });


    return rows.map(r => ({
      id:r.id ,
      name:r.name,
      creatorId:r.creatorId,
      image:r.image,
      bannerImage:r.bannerImage,
      createdAt:BigInt(r.createdAt.getTime()),
      latestUpdateAt:BigInt(r.latestUpdateAt.getTime()),
      Id:r.id,
      v: 0n,
    }));
  }

  export async function getSubredditsIdDb(str: string[]): Promise<SubredditMinimalMd[]> {
    const rows = await db.subreddit.findMany({
      where: {
        name: { in: str },
      },
      select: {
        id: true,
        name:true      
     },
    });
    return rows.map(r => ({Id:r.id,name:r.name}));
  }

export async function getMemberCount(ids:bigint[]): Promise<subredditMemCount[]>{
  var rows = await db.subscription.groupBy({
    by:['subredditId'],
    where:{subredditId:{in:ids}},
    _count:{subredditId:true}
  })
  console.log(rows)
  return rows.map(r => ({Id:r.subredditId,Count:r._count.subredditId}))
}

export async function getAllSubreddits(): Promise<{ id: bigint; name: string }[]> {
  return db.subreddit.findMany({
      select: { id: true, name: true },
  })
}

