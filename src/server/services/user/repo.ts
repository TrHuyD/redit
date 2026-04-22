import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { db } from "@/lib/db"
import { UserDto, UserProfileDto } from "@/types/user"

export async function getUsersBaseInfoById(ids: bigint[]): Promise<UserDto[]> {
    const rows = await db.user.findMany({
        where: { id: { in: ids } },
        select: {
            id: true,
            name: true,
            image: true,
            username:true
        }
    })
    return rows
}

export async function getUsersProfileInfoById(ids: bigint[]): Promise<UserProfileDto[]> {
    const rows = await db.user.findMany({
        where: { id: { in: ids } },
        select: {
            id: true,
            name: true,
            image: true,
            username:true,
            createdAt:true,
        }
    })
    return rows.map(r=>({...r,createdAt:r.createdAt.getTime(),banner:""}))
}
export async function getUsersByName(name:string[]): Promise<UserProfileDto[]>{
    const rows = await db.user.findMany({
        where: { username: { in: name } },
        select: {
            id: true,
            name: true,
            image: true,
            username:true,
            createdAt:true,
        }
    })
    return rows.map(r=>({...r,createdAt:r.createdAt.getTime(),banner:""}))
}

export async function getUsersPostIds({
    Id,
    orderBy = "desc",
    take = INFINITE_SCROLLING_PAGINATION_RESULTS,
    cursor,
}: {
    Id: bigint,
    orderBy?: "asc" | "desc"
    take?: number
    cursor?: bigint | number
}): Promise<bigint[]> {
    const posts = await db.post.findMany({
        where: { authorId: Id },
        select: { id: true },
        orderBy: { id: orderBy },
        take,
        ...(cursor && {
            cursor: { id: cursor },
            skip: 1,
        }),
    })
    return posts.map(p => p.id)
}