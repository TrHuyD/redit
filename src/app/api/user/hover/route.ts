import { UserValidator } from "@/lib/validators/user";
import { createRoute } from "@/server/lib/createRoute";
import { getUserProfileById } from "@/server/services/user/loader";
import { NextResponse } from "next/server";

export const GET = createRoute({auth: "none",schema: {query: UserValidator},handler: async ({query }) => {
    const user =await getUserProfileById(query.userId)
    if (!user) 
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    return new NextResponse(JSON.stringify(user))
},});