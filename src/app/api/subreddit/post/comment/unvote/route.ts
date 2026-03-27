
import { getId } from "@/lib/utils";
import { CommentUnVoteValidator } from "@/lib/validators/post";
import { withAuth } from "@/server/lib/withAuth";
import { withErrorHandler } from "@/server/lib/withErrorHandler";
import { UnVoteComment } from "@/server/services/subreddit/action";


export const  PATCH = withErrorHandler(withAuth( async (req:Request,token) =>
{
    const body = await req.json()
    const data =await CommentUnVoteValidator.parse(body)
    const id = getId(token)
    await UnVoteComment({...data,userId:id})
    return Response.json("ok")
}))