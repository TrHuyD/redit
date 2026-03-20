import {UserSubredditRequestPayload } from "@/lib/validators/subreddit";
import {db} from "@/lib/db"
import { Result } from "@/lib/Result"

export async function LeaveSubreddit(data: UserSubredditRequestPayload) : Promise<Result<null>>{
    const subreddit = await db.subreddit.findUnique({
        where: { id: data.subredditId },
        select: {
          id: true,
          creatorId: true
        }
      })
    if(!subreddit) return { ok: false, error: { message:"Subreddit not found"} }
    if(subreddit.creatorId === data.userId) return { ok: false, error: {message :"You can't leave your own subreddit!"} }
    await db.subscription.deleteMany({where: {subredditId: data.subredditId,userId: data.userId}})
    return { ok: true ,data:null}
     
}
    


