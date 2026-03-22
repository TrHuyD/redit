'use client'

import { votePost } from "@/lib/api/Subreddit/PostVote"
import { withToast } from "@/lib/withToast"
import { usePrevious } from "@mantine/hooks"
import { VoteType } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { ArrowBigDown, ArrowBigUp, Vote } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../Button"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { ID } from "@/types/ID"

interface PostVoteClientProps {
    postId: ID
    initialVotesAmt: number
    initialVote?: VoteType | null
  }
interface VoteButtonProps
{
    type:VoteType
}
export default function PostVoteClient({postId,initialVotesAmt,initialVote}:PostVoteClientProps)
{
        const [currentVote, setCurrentVote] = useState(initialVote)
        const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
        const prevVote = usePrevious(currentVote)
        const { data: session } = useSession()
        useEffect(() => setCurrentVote(initialVote),[initialVote])
        const {mutate: vote } = useMutation({
            mutationFn : withToast(async (type: VoteType)=> {
                return votePost({type:type,postId:postId})
            }),
            onMutate:(type:VoteType) =>
              {
                if(session?.user==null)
                  return;
                if (currentVote === type)
                {    
                    setCurrentVote(undefined)
                    if (type === VoteType.UPVOTE) setVotesAmt((prev) => prev - 1)
                    if (type === VoteType.DOWNVOTE) setVotesAmt((prev) => prev + 1)
                }
                else
                {
                    setCurrentVote(type)
                    if (type === VoteType.UPVOTE) setVotesAmt((prev) => prev + (currentVote? 2:1))
                    if (type === VoteType.DOWNVOTE) setVotesAmt((prev) => prev - (currentVote?2:1))
                }
            }
        })

        const   VoteButton = ({type} : VoteButtonProps) => {
            const isUp = type === VoteType.UPVOTE
            const active = currentVote === type
          
            const Icon = isUp ? ArrowBigUp : ArrowBigDown
          
            return (
              <Button
                onClick={() => vote(type)}
                size="sm"
                variant="ghost"
                aria-label={isUp ? 'upvote' : 'downvote'}
                className="rounded-full w-8 h-8 items-center hover:bg-zinc-300"
              >
                <Icon
                  className={cn('h-3.5 w-3.5 text-gray-600 dark:text-zinc-400', {
                    'text-emerald-500 fill-emerald-500': active && isUp,
                    'text-red-500 fill-red-500': active && !isUp,},)}/>
              </Button>
            )
        }
        return <div className='w-fit flex items-center gap-1  rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs text-gray-600 dark:text-zinc-400'>
            <VoteButton type={VoteType.UPVOTE}/>
                {votesAmt}
            <VoteButton type={VoteType.DOWNVOTE}/>

        </div>

}
  