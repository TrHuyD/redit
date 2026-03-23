
import { getId } from "@/lib/utils";
import { CommentVoteValidator } from "@/lib/validators/post";
import { withAuth } from "@/server/lib/withAuth";
import { withErrorHandler } from "@/server/lib/withErrorHandler";
import { VoteComment } from "@/server/services/subreddit/vote";

export const  PATCH = withErrorHandler(withAuth( async (req:Request,token) =>
{
    const body = await req.json()
    const data =await CommentVoteValidator.parse(body)
    const id = getId(token)
    await VoteComment({...data,userId:id})
    return Response.json("ok")
}))