
import { getId } from "@/lib/utils";
import { PostVoteValidator } from "@/lib/validators/post";
import { withAuth } from "@/server/lib/withAuth";
import { withErrorHandler } from "@/server/lib/withErrorHandler";
import { VotePost } from "@/server/services/subreddit/vote";

export const  PATCH = withErrorHandler(withAuth( async (req:Request,token) =>
{
    const body = await req.json()
    const data =await PostVoteValidator.parse(body)
    const id = getId(token)
    await VotePost({...data,userId:id})
    return Response.json("ok")
}))