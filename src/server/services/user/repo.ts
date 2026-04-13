import { db } from "@/lib/db"
import { UserDto, UserProfileDto } from "@/types/Users/dto"

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

