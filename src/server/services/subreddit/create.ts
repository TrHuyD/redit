import { CreateSubredditRequestPayload } from "@/lib/validators/subreddit"
import {db} from "@/lib/db"
import { Result } from "@/lib/Result"
import { Subreddit } from "@prisma/client"
import {  generateSubredditId } from "../Snowflake"
import { addSubredditsAutocomplete } from "./loader"
import { error } from "node:console"
export async function createSubreddit(data: CreateSubredditRequestPayload): Promise<Result<Subreddit>> {

  if(data.name=="metadata"||data.name=="membercount")
    {return { ok: false, error: { code: "409", message: "SUBREDDIT_EXISTS" } }}
  const existing = await db.subreddit.findUnique({where: { name: data.name }})
  if (existing) {return { ok: false, error: { code: "409", message: "SUBREDDIT_EXISTS" } }}
  const id = generateSubredditId()
  return await db.$transaction(async (tx) => {
    const subreddit = await tx.subreddit.create({
      data: {
        id: id,
        name: data.name,
        creatorId: data.userId,
        ...(data.avatarImage ? { image: data.avatarImage } : {}),
        ...(data.bannerImage ? { bannerImage: data.bannerImage } : {}),
      }
    })
    await tx.subscription.create({
      data: { 
        userId: data.userId,
        subredditId: id
      }
    })
    await addSubredditsAutocomplete([{id:id,name:data.name}])
    return { ok: true, data: subreddit }
  })
}