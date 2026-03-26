
import { SubredditBaseMd, SubredditMinimalMd } from "@/types/dto";
import { createCachedBatchLoader, createCachedBatchLoader2 } from "../cache/Pipeline";

import { createSingleLoader } from "@/lib/utils";
import * as db from "./repo";
import { subredditMemCount } from "./type";


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

