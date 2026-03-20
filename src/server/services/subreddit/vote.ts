import { db } from "@/lib/db"
import { Result } from "@/lib/Result"
import { PostVoteRequestPayload } from "@/lib/validators/post"

export async function VotePost({type,postId,userId}: PostVoteRequestPayload) : Promise<Result<null>>{
    console.log(type)
    await db.postVote.upsert({ 
        where: { postId_userId: { postId, userId, }, }, 
        update: { type: type }, 
        create: { userId, postId, type: type, }, })
    return { ok: true ,data:null}
     
}
    


