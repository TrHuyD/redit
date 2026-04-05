'use client'

import { useState } from 'react'
import { Button } from '../button'
import { CommentEditor } from './CommentEditor'

import { useAuth } from '../providers/auth-provider'
import { loginToast } from '@/lib/customToast'
import { withToast } from '@/lib/withToast'
import axios from 'axios'
import { CommentContentValidator, CreateCommentValidator } from '@/lib/validators/post'
import { useRouter } from 'next/navigation'

interface PostCommentButtonProps {
  postId: bigint
}

export const PostCommentButton = ({ postId }: PostCommentButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  if (!isOpen) {
    return (
      <Button
        onClick={() => {
          if (isLoggedIn) setIsOpen(true)
          else loginToast()
        }}
        className="w-full border-zinc-200 rounded-full justify-start h-10 text-zinc-500 hover:text-zinc-500"
        variant="ghost"
      >
        Join the conversation
      </Button>
    )
  }

  return (
    <CommentEditor
      onCancel={() => setIsOpen(false)}
      onPost={async(text) => {
        var content = CommentContentValidator.parse({text:text})
        var payload = CreateCommentValidator.parse({postId:postId, content:content,parentId:null})
        await withToast(async() =>{await axios.post(`/api/subreddit/post/comment`, payload)})()
        router.refresh()
        setIsOpen(false)
      }}
    />
  )
}