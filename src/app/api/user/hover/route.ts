import { UserValidator } from "@/lib/validators/user";
import { createRoute } from "@/server/lib/createRoute";
import { getUserProfileById } from "@/server/services/user/loader";
import { NextResponse } from "next/server";

export const GET = createRoute({auth: "none",schema: {query: UserValidator},handler: async ({ req, query }) => {
    const output =await getUserProfileById(query.userId)
    if (!output) 
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    return new NextResponse(JSON.stringify(output))
},});