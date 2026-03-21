import { CreateSubredditRequestPayload } from "@/lib/validators/subreddit"
import {db} from "@/lib/db"
import { Result } from "@/lib/Result"
import { Subreddit } from "@prisma/client"
import {  generateSubredditId } from "../Snowflake"
export async function createSubreddit(data: CreateSubredditRequestPayload): Promise<Result<Subreddit>> {

  const existing = await db.subreddit.findUnique({where: { name: data.name }})
  if (existing) {return { ok: false, error: { code: "409", message: "SUBREDDIT_EXISTS" } }}
  const id = generateSubredditId()
  return await db.$transaction(async (tx) => {
    const subreddit = await tx.subreddit.create({
      data: {
        id: id,
        name: data.name,
        creatorId: data.userId
      }
    })
    await tx.subscription.create({
      data: {
        userId: data.userId,
        subredditId: id
      }
    })

    return { ok: true, data: subreddit }
  })
}