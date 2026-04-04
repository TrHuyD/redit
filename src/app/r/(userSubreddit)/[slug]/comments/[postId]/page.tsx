
import CombinedTag from "@/components/ui/post/CombinedTag"
import CommentAmtDisplay from "@/components/ui/post/CommentAmtDisplay"
import CommentsSection from "@/components/ui/post/CommentSection"
import EditorOutput from "@/components/ui/post/EditorOutput"
import { PostCommentButton } from "@/components/ui/post/PostCommentButton"
import PostVoteClient from "@/components/ui/post/PostVoteClient"

import { getAuthToken } from "@/lib/auth"
import { formatTimeToNow, getIdnull } from "@/lib/utils"


import { getPostById } from "@/server/services/subreddit/post/service"

import { notFound } from "next/navigation"


interface PageProps {
    params: Promise<{
    postId: bigint
    }>
}
  export const dynamic = 'force-dynamic'
  export const fetchCache = 'force-no-store'
  
  const SubRedditPostPage = async ({ params }: PageProps) => {
    const {postId} = await params;
    const userId= getIdnull( await getAuthToken())
    const post = await getPostById({postId,userId})  
    if (!post) return notFound()
  
    return (
      <div className="pl-10">
         
         <div className="flex items-center gap-2">
           <CombinedTag user= {post.creator} subreddit={post.subreddit}/>
          <span className="text-xs text-gray-500">
            {formatTimeToNow(new Date(post.createdAt))}
          </span>
          </div>
            <div className="ml-1">
            <h1 className="block relative before:content-[''] before:absolute before:inset-0 before:z-0 font-bold">
            {post.title}
            </h1>
            <EditorOutput content={post.content } />
            </div>
                <div className='flex gap-3 py-4'>  
                <PostVoteClient postId={post.id} initialVote={post.currentVote} initialVotesAmt={post.stat.votesAmt}/>
                <CommentAmtDisplay amt={post.stat.commentsAmt} ></CommentAmtDisplay>
                </div> 
            <PostCommentButton postId={postId}></PostCommentButton>
            <CommentsSection postId={postId}/>
      </div>
    )
  }
  


  
  export default SubRedditPostPage