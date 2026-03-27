'use client'
import { Button } from '@/components/ui/Button'
import { loginToast } from '@/lib/customToast'
import { cn } from '@/lib/utils'
import { CommentUnVotePayload, CommentVotePayload } from '@/lib/validators/post'
import { withToast } from '@/lib/withToast'

import { VoteType } from '@/types/enum'
import { usePrevious } from '@mantine/hooks'

import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import {  useState } from 'react'

interface CommentVotesProps {
  commentId: bigint
  votesAmt: number
  currentVote?: VoteType |undefined
}


const CommentVotes = ({commentId,votesAmt: _votesAmt,currentVote:_currentVote}:CommentVotesProps) => {
  const [votesAmt, setVotesAmt] = useState<number>(_votesAmt)
  const [currentVote, setCurrentVote] = useState<VoteType | undefined>(
    _currentVote
  )
  const prevVote = usePrevious(currentVote)

  const { mutate: vote } = useMutation({
    mutationFn:  withToast(async (type: VoteType) => {
      if(type==currentVote)
      {
        const payload: CommentVotePayload = {
          voteType: type,
          commentId,
        }
        await axios.patch('/api/subreddit/post/comment/vote', payload)
      }
      else
      {
        
        const payload: CommentUnVotePayload = {
          commentId,
        }
        await axios.patch('/api/subreddit/post/comment/unvote', payload)

      }
    }),
    onError: (err, voteType) => {
        setVotesAmt((prev) => prev - voteType)
         // reset current vote
        setCurrentVote(prevVote)
        if (err instanceof AxiosError) {
            if (err.response?.status === 401) {
            return loginToast()
            }
        }
    },
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        setCurrentVote(undefined)
        setVotesAmt((prev) => prev - type)
      } else {
        setCurrentVote(type)
        if (type ==1) setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
        else if (type ==-1)
          setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
      }
    },
  })

  return (
    <div className='flex gap-1'>
      {/* upvote */}
      <Button
        onClick={() => vote(VoteType.UPVOTE)}
        size='xs'
        variant='ghost'
        aria-label='upvote'>
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'text-emerald-500 fill-emerald-500': currentVote === VoteType.UPVOTE,
          })}
        />
      </Button>

      {/* score */}
      <p className='text-center py-2 px-1 font-medium text-xs text-zinc-900'>
        {votesAmt}
      </p>

      {/* downvote */}
      <Button
        onClick={() => vote(VoteType.DOWNVOTE)}
        size='xs'
        className={cn({
          'text-emerald-500': currentVote === VoteType.DOWNVOTE,
        })}
        variant='ghost'
        aria-label='downvote'>
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700', {
            'text-red-500 fill-red-500': currentVote === VoteType.DOWNVOTE,
          })}
        />
      </Button>
    </div>
  )
}

export default CommentVotes