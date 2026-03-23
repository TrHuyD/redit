import { db } from "@/lib/db"
import { Result } from "@/lib/Result"
import { CommentVoteRequest, PostVoteRequestPayload } from "@/lib/validators/post"

export async function VotePost({type,postId,userId}: PostVoteRequestPayload) : Promise<Result<null>>{
    await db.postVote.upsert({ 
        where: { postId_userId: { postId, userId, }, }, 
        update: { type: type }, 
        create: { userId, postId, type: type, }, })
    return { ok: true ,data:null}
     
}


export async function VoteComment({voteType:type,commentId,userId}: CommentVoteRequest) : Promise<Result<null>>{
    await db.commentVote.upsert({ 
        where: { commentId_userId: { commentId, userId, }, }, 
        update: { type: type }, 
        create: { userId, commentId, type: type, }, })
    return { ok: true ,data:null}
     
}
    



    


