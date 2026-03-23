'use client'

import { formatTimeToNow } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { UserAvatar } from '../user/UserAvatar'
import CommentVotes from './CommentVote'
import { CommentContentValidator, CreateCommentValidator } from '@/lib/validators/post'
import { MessageSquare } from 'lucide-react'
import { useAuth } from '../providers/auth-provider'
import { loginToast } from '@/lib/customToast'
import { withToast } from '@/lib/withToast'
import axios from 'axios'
import { CommentEditor } from './CommentEditor'
import { CommentPerDto } from '@/types/dto'

interface PostCommentProps {
  comment: CommentPerDto
  parentsId?: bigint
  postId: bigint
  children?: React.ReactNode
}

const PostComment = ({ comment, parentsId, postId, children }: PostCommentProps) => {
  const [isReplying, setIsReplying] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const commentRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const parsedContent = CommentContentValidator.parse(comment.content)

  return (
    <div ref={commentRef} className="py-1">

      <div className="flex items-center gap-2 mb-1">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="h-8 w-8 rounded-full flex-shrink-0"
        />
        <span className="text-sm font-semibold text-zinc-900 hover:underline cursor-pointer leading-none">
          {comment.author.name}
        </span>
        <span className="text-xs text-zinc-500 leading-none">
          {formatTimeToNow(new Date(comment.createdAt))}
        </span>
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="text-xs text-zinc-400 hover:text-zinc-600"
          >
            [+]
          </button>
        )}
      </div>

      {!isCollapsed && (
        <>
          <p className="text-sm text-zinc-900 leading-relaxed mb-2 break-words pl-10">
            {parsedContent.text}
          </p>

          <div className="flex items-center gap-0.5 pl-8 mb-2">
            <CommentVotes
              commentId={comment.id}
              votesAmt={comment.voteAmt}
              currentVote={comment.voteType ?? undefined}
            />

            <button
              onClick={() => {
                if (isLoggedIn) setIsReplying((p) => !p)
                else loginToast()
              }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Reply
            </button>

            <button className="px-2 py-1 rounded-full text-xs font-bold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition-colors">
              •••
            </button>
          </div>

          {isReplying && (
            <div className="pl-10 mt-2 mb-2">
              <CommentEditor
                onCancel={() => setIsReplying(false)}
                onPost={async (text) => {
                  const content = CommentContentValidator.parse({ text })
                  const payload = CreateCommentValidator.parse({
                    postId,
                    content,
                    parentId: parentsId ?? comment.id,
                  })
                  await withToast(async () => {
                    await axios.post(`/api/subreddit/post/comment`, payload)
                  })()
                  router.refresh()
                  setIsReplying(false)
                }}
              />
            </div>
          )}

          {children && (
            <div
              className="ml-4 mt-2 pl-3 border border-zinc-200 rounded-lg"
              onClick={() => isCollapsed && setIsCollapsed(false)}
            >
              {children}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PostComment