import CombinedTag from "@/components/ui/post/CombinedTag"
import CommentAmtDisplay from "@/components/ui/post/CommentAmtDisplay"
import EditorOutput from "@/components/ui/post/EditorOutput"
import PostVoteClient from "@/components/ui/post/PostVoteClient"
import UsernameTag from "@/components/ui/post/UsernameTag"
import { getAuthToken } from "@/lib/auth"
import { formatTimeToNow, getIdnull } from "@/lib/utils"
import { redis } from "@/server/lib/redis"
import { getPost } from "@/server/services/subreddit/Get"
import { Loader2 } from "lucide-react"
import { notFound } from "next/navigation"
import { Suspense } from "react"

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
    const post = await getPost({postId,userId})  
    if (!post) return notFound()
  
    return (
      <div>
         
           <CombinedTag user= {post.creator} subreddit={post.subreddit}/>
            <div className="ml-1">
            <EditorOutput content={post.content } />
            </div>
                <div className='flex gap-3 py-1'>  
                <PostVoteClient postId={post.id} initialVote={post.currentVote} initialVotesAmt={post.votesAmt}/>
                <CommentAmtDisplay amt={post.commentsAmt} ></CommentAmtDisplay>
                </div> 
      </div>
    )
  }
  


  
  export default SubRedditPostPage