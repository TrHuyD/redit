'use client'
import { formatTimeToNow } from '@/lib/utils'
import {  PostVote,  } from '@prisma/client'
import UsernameTag from './UsernameTag'
import SubredditTag from './SubredditTag'
import CombinedTag from './CombinedTag'
import { useRef } from 'react'
import CommentAmtDisplay from './CommentAmtDisplay'
import EditorOutput from './EditorOutput'
import PostVoteClient from './PostVoteClient'
import { PostDto } from '@/types/dto'
import Link from 'next/link'
interface PostProps {
    post: PostDto,
    displayType : "both"|"user"|"subreddit"
  }
type PartialVote = Pick<PostVote, 'type'>
export default function PostOut({  post,displayType}: PostProps) {
    const pRef = useRef<HTMLParagraphElement>(null)
    return <div className="rounded-md shadow bg-white hover:bg-slate-100 dark:shadow-black/50 dark:bg-slate-900" >
        <Link href={`/r/${post.subreddit.name}/comments/${post.id}`} prefetch={false} legacyBehavior={true} >
        <div className='px-4' >
        <div className="py-1 flex items-center gap-2">
            
            {displayType === "user" && <UsernameTag user={post.creator} />}
            {displayType === "subreddit" && <SubredditTag subreddit={post.subreddit} />}
            {displayType === "both" && <CombinedTag user={post.creator}  subreddit={post.subreddit} />}
          
            <span className="text-sm text-gray-500 ">
              {formatTimeToNow(new Date(post.createdAt))}
            </span>
          </div>
          
          <h1 className='px-2 text-lg font-semibold py-1 leading-6'>
              {post.title}
          </h1>
          
          <div className='px-2'>

          <div
            className='relative text-sm max-h-40 w-full overflow-clip'
            ref={pRef}>
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
               <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t'></div>
            ) : null}
          </div >
            <div className='flex gap-3 py-1'>  
              <div
                className="vote-container inline-block"
                onClick={(e) => {e.stopPropagation();e.preventDefault();}} 
                style={{ cursor: 'default' }}        
              >
              <PostVoteClient postId={post.id} initialVote={post.currentVote} initialVotesAmt={post.votesAmt}/>
              </div>
              <CommentAmtDisplay amt={post.commentsAmt} ></CommentAmtDisplay>
              </div> 
          </div>       
          </div>    
          </Link>
       </div>
}