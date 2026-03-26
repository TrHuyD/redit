import { db } from "@/lib/db"
import { UserDto } from "@/types/Users/dto"

export async function getUsersById(ids: bigint[]): Promise<UserDto[]> {
    const rows = await db.user.findMany({
        where: { id: { in: ids } },
        select: {
            id: true,
            name: true,
            image: true,
        }
    })
    return rows.map(r => ({
        id: r.id,
        name: r.name ,
        image: r.image ,
    }))
}

