import { CreateSubredditRequestPayload } from "@/lib/validators/subreddit"
import {db} from "@/lib/db"
import { Result } from "@/lib/Result"
import { Subreddit } from "@prisma/client"
export async function createSubreddit(data: CreateSubredditRequestPayload) : Promise<Result<Subreddit>>{

    const existing = await db.subreddit.findUnique({
        where: { name: data.name }
      })
      
      if (existing) {
        return { ok: false, error: "SUBREDDIT_EXISTS" }
      }

      const subreddit = await db.subreddit.create({
        data: {
          name: data.name,
          creatorId: data.userId
        }
      })
    
      return { ok: true, data: subreddit }
    }