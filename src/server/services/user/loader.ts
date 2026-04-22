import { createSingleLoader } from "@/lib/utils";
import { rediskey } from "@/types/rediskey";
import { UserDto, UserProfileDto } from "@/types/user";
import { createCachedBatchLoader, createCachedBatchLoader2, getSortedUnique } from "../cache/Pipeline";
import * as db from "./repo";

export const getUsersById= createCachedBatchLoader2<bigint,UserDto>({
    keyFn: (id) => rediskey.user.baseInfo(id),
    fetch: db.getUsersBaseInfoById,
    map: (md) => md.id,
    ttl: 120000,
    nullTtl: 30,
})

export const getUsersId = createCachedBatchLoader<string,UserDto,bigint>({
    keyFn: (str) => rediskey.user.nameParse(str.toLowerCase()),
    fetch: db.getUsersByName,
    map: (md) => md.username,
    select: (md) => md?.id ?? null,
    ttl: 1200000,
    nullTtl: 30,
  })
export const getUsersProfileById= createCachedBatchLoader2<bigint,UserProfileDto>({
    keyFn: (id) => rediskey.user.profileInfo(id),
    fetch: db.getUsersProfileInfoById,
    map: (md) => md.id,
    ttl: 240,
    nullTtl: 30,
})
export const getUserById =createSingleLoader(getUsersById)
export const getUserProfileById =createSingleLoader(getUsersProfileById)
export const getUserId= createSingleLoader(getUsersId)

export async function getUserSubredditHistory(userId:bigint){
    return await getSortedUnique(rediskey.user.subHistory(userId),rediskey.user.subHistoryLimit)
} 