
import { getId } from "@/lib/utils";
import { PostUnVoteValidator } from "@/lib/validators/post";
import { withAuth } from "@/server/lib/withAuth";
import { withErrorHandler } from "@/server/lib/withErrorHandler";
import { UnVotePost } from "@/server/services/subreddit/action";


export const  PATCH = withErrorHandler(withAuth( async (req:Request,token) =>
{
    const body = await req.json()
    const data =await PostUnVoteValidator.parse(body)
    const id = getId(token)
    await UnVotePost({...data,userId:id})
    return Response.json("ok")
}))