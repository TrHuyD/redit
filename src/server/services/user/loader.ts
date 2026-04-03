import { UserDto } from "@/types/Users/dto";
import * as db from "./repo";
import { createCachedBatchLoader2, getBigInts, getSortedUnique } from "../cache/Pipeline";
import { createSingleLoader } from "@/lib/utils";
import { rediskey } from "@/types/rediskey";

export const getUsersById= createCachedBatchLoader2<bigint,UserDto>({
    keyFn: (id) => `user:${id}:metadata`,
    fetch: db.getUsersById,
    map: (md) => md.id,
    ttl: 1200,
    nullTtl: 30,
})
export const getUserById =createSingleLoader(getUsersById)

export async function getUserSubredditHistory(userId:bigint){
    return await getSortedUnique(rediskey.user.subHistory(userId),rediskey.user.subHistoryLimit)
} 