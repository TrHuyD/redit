
import { createCachedBatchLoader, createCachedBatchLoader2 } from "../cache/Pipeline";

import { createSingleLoader, filterNull } from "@/lib/utils";
import * as db from "./repo";
import { SubredditBaseMd, SubRedditDto, subredditMemCount, SubredditMinimalMd, UserSubredditBaseMd } from "@/types/subreddit";
import { isMember } from "@/server/services/subreddit/Get"
import { cache } from "react";
import { redis } from "@/server/lib/redis";
import { rediskey } from "@/types/rediskey";



export const getSubredditsMetadata = createCachedBatchLoader2<bigint, SubredditBaseMd>({
    keyFn: (id) =>rediskey.subreddit.metadata(id),
    fetch: db.getSubreddits,
    map: (post) => post.Id,
    ttl: 120000,nullTtl:30})

export const getSubredditsId = createCachedBatchLoader<string,SubredditMinimalMd,bigint>({
    keyFn: (str) => `idParse:subreddit:${str.toLowerCase()}`,
    fetch: db.getSubredditsIdDb,
    map: (md) => md.name,
    select: (md) => md?.Id ?? null,
    ttl: 1200000,
    nullTtl: 30,
  })

export const getSubredditsMemberCount = createCachedBatchLoader<bigint,subredditMemCount,number>({
    keyFn: (id) => rediskey.subreddit.membercount(id),
    fetch: db.getMemberCount,
    map: (md) => md.Id,
    select: (md) => md?.Count ?? 1,
    ttl: 1200000,
    nullTtl: 30,
})

export const getSubredditMetadata =createSingleLoader(getSubredditsMetadata)
export const getSubredditId =createSingleLoader(getSubredditsId)
export const getSubredditMemberCount =createSingleLoader(getSubredditsMemberCount)

export const getSubredditUserMD = cache(async (slug: string, userId?: bigint) => {
    const id = await getSubredditId(slug)
    if (!id) return null
    const [subredditMd, memberCount, isMem] = await Promise.all([
        getSubredditMetadata(id),
        getSubredditMemberCount(id),
        isMember(id, userId),
    ])
    const subreddit= {...subredditMd!,userCount:memberCount!,isCreator:subredditMd?.creatorId==userId,isMember:isMem} as UserSubredditBaseMd
    return subreddit
})



export async function seedSubredditAutocomplete(): Promise<void> {
    const subreddits = await db.getAllSubreddits();
    await addSubredditsAutocomplete(subreddits)    
    console.log("Subreddit autocomplete seeded!");
  }
export async function addSubredditsAutocomplete(subreddits:{ id: bigint; name: string }[]){
    if (!subreddits.length) return;
    const pipeline = redis.pipeline();
    for (const s of subreddits) {
        pipeline.call("FT.SUGADD", rediskey.subreddit.autocomplete, s.name,"1","PAYLOAD",s.id.toString());}
    await pipeline.exec();
}

export async function searchSubredditAutocomplete(query: string, maxResults = 10, fuzzy = false): Promise<SubRedditDto[]> {
    const args: string[] = [ rediskey.subreddit.autocomplete, query, "MAX", maxResults.toString(), "WITHPAYLOADS",];
    if (fuzzy) args.push("FUZZY");
    const result = (await redis.call("FT.SUGGET", ...args)) as string[];
    let ids:bigint[]=[];
    for(let i =0;i+1<result.length;i+=2){
        ids.push(BigInt(result[i+1]))
    }
    let subs=filterNull(await getSubredditsMetadata(ids))
    return subs.map(s=>({...s} as SubRedditDto));
  }