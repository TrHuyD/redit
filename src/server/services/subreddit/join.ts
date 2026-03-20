import { UserSubredditRequestPayload } from "@/lib/validators/subreddit";
import {db} from "@/lib/db"
import { Result } from "@/lib/Result"
import { Prisma } from "@prisma/client";
export async function JoinSubreddit(data: UserSubredditRequestPayload) : Promise<Result<null>>{
    try {
        await db.subscription.create({
          data: {
            subredditId: data.subredditId,
            userId: data.userId
          }
        })
        return { ok: true ,data:null}
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2002")
            return { ok: false, error: {code:"409", message:"User already joined this subreddit"} }
      
          if (err.code === "P2003")
            return { ok: false, error:{code:"500",message: "Subreddit not found" }}
        }
      
        throw err
      }
}
    


