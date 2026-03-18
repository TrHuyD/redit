'use client'
import { formatTimeToNow } from '@/lib/utils'
import { Post, User, PostVote, Subreddit } from '@prisma/client'
import UsernameTag from './UsernameTag'
import SubredditTag from './SubredditTag'
import CombinedTag from './CombinedTag'
import { useRef } from 'react'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import CommentAmtDisplay from './CommentAmtDisplay'
import EditorOutput from './EditorOutput'
interface PostProps {
    post: Post & {
      author: User
      votes: PostVote[]
    }
    votesAmt: number
    subreddit: Subreddit
    currentVote?: PartialVote
    commentAmt: number
  }
type PartialVote = Pick<PostVote, 'type'>
export default function PostOut({  post,
  votesAmt: _votesAmt,
  currentVote: _currentVote,
  subreddit,
  commentAmt,}: PostProps) {
    const pRef = useRef<HTMLParagraphElement>(null)
    return <div className="rounded-md shadow dark:shadow-black/50">
        <div className='px-4' >
        <div className="py-1 flex items-center gap-2">
            <span>
              {/* <UsernameTag user={post.author} /> */}
            
            </span>
            <UsernameTag user={post.author} />
            <span className="text-sm text-gray-500">
              {formatTimeToNow(new Date(post.createdAt))}
            </span>
          </div>

          <a href={`/r/${subreddit.name}/post/${post.id}`}>
          <h1 className='px-2 text-lg font-semibold py-1 leading-6'>
              {post.title}
          </h1>
          </a>
          
          <div className='px-2'>

          <div
            className='relative text-sm max-h-40 w-full overflow-clip'
            ref={pRef}>
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t to-transparent'></div>
            ) : null}
          </div>   
              <CommentAmtDisplay amt={commentAmt}/>
          </div>       
          </div>    
       </div>
}