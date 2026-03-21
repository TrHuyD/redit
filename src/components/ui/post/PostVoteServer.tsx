import PostVoteClient from "@/components/ui/post/PostVoteClient"
import { getAuthToken } from "@/lib/auth"
import { getId } from "@/lib/utils"
import { ID } from "@/types/ID"
import { Post, PostVote, VoteType } from "@prisma/client"
import { notFound } from "next/navigation"

interface PostVoteServerProps {
    postId: ID
    initialVotesAmt?: number
    initialVote?: PostVote | null
    getData?: () => Promise<(Post & { votes: PostVote[] }) | null>
  }
const PostVoteServer = () => async ({
    postId,
    initialVotesAmt,
    initialVote,
    getData,
  }: PostVoteServerProps) => {
    const session = await getAuthToken()
    const id = session? getId(session) : null
    let _votesAmt: number = 0
    let _currentVote: PostVote['type'] | null | undefined = undefined
  
    if (getData) {
      // fetch data in component
      const post = await getData()
      if (!post) return notFound()
  
      _votesAmt = post.votes.reduce((acc, vote) => {
        if (vote.type==VoteType.UPVOTE) return acc + 1
        if (vote.type==VoteType.DOWNVOTE) return acc - 1
        return acc
      }, 0)
  
      _currentVote = id? post.votes.find(
        (vote) => vote.userId === id
      )?.type:null
    } else {
      _votesAmt = initialVotesAmt!
      _currentVote =initialVote?.type 
    }
  
    return (
      <PostVoteClient
        postId={postId}
        initialVotesAmt={_votesAmt}
        initialVote={_currentVote}
      />
    )
  }
  
export default PostVoteServer