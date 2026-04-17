import { db } from "@/lib/db";
import { passwordSchema } from "@/lib/validators/cron";
import { createRoute } from "@/server/lib/createRoute";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import z from "zod";
const utapi = new UTApi();
export const simpleJob = z.object({
    password:passwordSchema
})

export const GET = createRoute({auth: "none",schema: {query: simpleJob,},handler: async ({ query }) => {
    if(query.password!=process.env.NEXTAUTH_SECRET)
        return NextResponse.json({ error: "wrong password" }, { status: 500 });
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)
    await db.mediaImgPost.updateMany({
        where: {
          postId: null,
          markedForDeletion: false,
          createdAt: {
            lte: cutoff,
          },
        },
        data: {
          markedForDeletion: true,
        },
      })
    const items = await db.mediaImgPost.findMany({
        where: {
          markedForDeletion: true,
        },
        select: {
          key: true,
        },
        take: 100, 
      })
    const keys = items.map((x) => x.key)
    if (keys.length === 0) 
        return NextResponse.json({ ok: "nothing to clean" })
    try {
        await utapi.deleteFiles(keys)
      } catch (err) {
        return NextResponse.json(
          { error: "file deletion failed" },
          { status: 500 }
        )
      }
    await db.mediaImgPost.deleteMany({
        where: {
          key: { in: keys },
          markedForDeletion: true,
        },
      })
    return NextResponse.json({ok:`deleted ${keys.length} files`})
},});