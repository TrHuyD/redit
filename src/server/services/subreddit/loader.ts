
import { createCachedBatchLoader, createCachedBatchLoader2 } from "../cache/Pipeline";

import { createSingleLoader } from "@/lib/utils";
import * as db from "./repo";
import { SubredditBaseMd, subredditMemCount, SubredditMinimalMd, UserSubredditBaseMd } from "@/types/subreddit";
import { isMember } from "@/server/services/subreddit/Get"
import { cache } from "react";



export const getSubredditsMetadata = createCachedBatchLoader2<bigint, SubredditBaseMd>({
    keyFn: (id) => `subreddit:${id}:metadata`,
    fetch: db.getSubreddits,
    map: (post) => post.Id,
    ttl: 1200,nullTtl:30})

export const getSubredditsId = createCachedBatchLoader<string,SubredditMinimalMd,bigint>({
    keyFn: (str) => `idParse:subreddit:${str}`,
    fetch: db.getSubredditsIdDb,
    map: (md) => md.name,
    select: (md) => md?.Id ?? null,
    ttl: 1200000,
    nullTtl: 30,
  })

export const getSubredditsMemberCount = createCachedBatchLoader<bigint,subredditMemCount,number>({
    keyFn: (id) => `subreddit:${id}:membercount`,
    fetch: db.getMemberCount,
    map: (md) => md.Id,
    select: (md) => md?.Count ?? null,
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