import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db' 
import { getAuthToken} from '@/lib/auth' 
import { CreateCommentValidator } from '@/lib/validators/post'
import { withErrorHandler } from '@/server/lib/withErrorHandler'
import { withAuth } from '@/server/lib/withAuth'
import { getId } from '@/lib/utils'
import { generateCommentId } from '@/server/services/Snowflake'
export const POST = withErrorHandler(withAuth(async (req: NextRequest,token) =>{
  try {
    const id = getId(token)
    const body = await req.json()

    const result = CreateCommentValidator.parse(body)

    const { postId, content, parentId } = result
    const comment = await db.comment.create({
      data: {
        id : generateCommentId(),
        content,
        postId,
        replyToId: parentId ?? null,
        authorId: id,
      },
    })

    return NextResponse.json(comment)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}))