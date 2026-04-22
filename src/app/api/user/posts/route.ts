import { UserPostsRetrieveValidator } from "@/lib/validators/user";
import { createRoute } from "@/server/lib/createRoute";
import { getUsersPosts } from "@/server/services/user/service";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

export const GET = createRoute({auth: "optional",schema: {query:UserPostsRetrieveValidator },handler: async ({ userId, query }) => {
    var result = await getUsersPosts({username:query.username,cursor:query.cursorId,userId})
    if(!result)
        return notFound()
    return NextResponse.json(result)
},});