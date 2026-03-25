import { db } from "@/lib/db";
import { SubredditBaseMd, SubredditMinimalMd } from "@/types/dto";
import { createCachedBatchLoader } from "../cache/Pipeline";
import { promises } from "node:dns";
import { createSingleLoader } from "@/lib/utils";

async function getSubreddits(ids: bigint[]): Promise<SubredditBaseMd[]> {
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

      },
    });
    return rows.map(r => ({
      ...r ,
      Id:r.id,
      v: 0n,
    }));
  }

async function getSubredditsIdDb(str: string[]): Promise<SubredditMinimalMd[]> {
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
interface subredditMemCount{
  Id: bigint,
  Count:number
}
async function getMemberCount(ids:bigint[]): Promise<subredditMemCount[]>{
  var rows = await db.subscription.groupBy({
    by:['subredditId'],
    where:{subredditId:{in:ids}},
    _count:{subredditId:true}
  })
  return rows.map(r => ({Id:r.subredditId,Count:r._count.subredditId}))
}

export const getSubredditsMetadata = createCachedBatchLoader<bigint, SubredditBaseMd>({
    keyFn: (id) => `subreddit:metadata:${id}`,
    fetch: getSubreddits,
    map: (post) => post.Id,
    ttl: 1200,nullTtl:30})

export const getSubredditsId = createCachedBatchLoader<string,SubredditMinimalMd,bigint>({
    keyFn: (str) => `subreddit:${str}:id`,
    fetch: getSubredditsIdDb,
    map: (md) => md.name,
    select: (md) => md?.Id ?? null,
    ttl: 1200000,
    nullTtl: 30,
  })

export const getSubredditsMemberCount = createCachedBatchLoader<bigint,subredditMemCount,number>({
    keyFn: (id) => `subreddit:membercount:${id}`,
    fetch: getMemberCount,
    map: (md) => md.Id,
    select: (md) => md?.Count ?? null,
    ttl: 1200000,
    nullTtl: 30,
})

export const getSubredditMetadata =createSingleLoader(getSubredditsMetadata)
export const getSubredditId =createSingleLoader(getSubredditsId)
export const getSubredditMemberCountSingle =createSingleLoader(getSubredditsMemberCount)