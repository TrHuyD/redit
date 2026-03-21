import { withAuth } from "@/server/lib/withAuth";
import { withErrorHandler } from "@/server/lib/withErrorHandler";
import { NextRequest } from "next/server";

export const GET = withErrorHandler(withAuth(async (req:NextRequest,token) =>{
    return Response.json("ok");  
}))