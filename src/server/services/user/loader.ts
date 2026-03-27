import { UserDto } from "@/types/Users/dto";
import * as db from "./repo";
import { createCachedBatchLoader2 } from "../cache/Pipeline";
import { createSingleLoader } from "@/lib/utils";

export const getUsersById= createCachedBatchLoader2<bigint,UserDto>({
    keyFn: (id) => `user:${id}:metadata`,
    fetch: db.getUsersById,
    map: (md) => md.id,
    ttl: 1200,
    nullTtl: 30,
})
export const getUserById =createSingleLoader(getUsersById)