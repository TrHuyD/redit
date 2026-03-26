'use client'

import { formatTimeToNow } from '@/lib/utils'
import UsernameTag from './UsernameTag'
import SubredditTag from './SubredditTag'
import CombinedTag from './CombinedTag'
import { useRef } from 'react'
import CommentAmtDisplay from './CommentAmtDisplay'
import EditorOutput from './EditorOutput'
import PostVoteClient from './PostVoteClient'

import Link from 'next/link'
import { PostUserDto } from '@/types/post'

interface PostProps {
  post: PostUserDto
  displayType: 'both' | 'user' | 'subreddit'
}

export default function PostOut({ post, displayType }: PostProps) {
  const pRef = useRef<HTMLDivElement>(null)
  const postHref = `/r/${post.subreddit.name}/comments/${post.id}`

  return (
    // "parent" — nearest positioned ancestor, so the ::before overlay fills it
    <div className="relative rounded-md shadow bg-white hover:bg-slate-50 dark:shadow-black/50 dark:bg-slate-900">

      {/*
        Main link — expands via ::before to cover the entire card.
        Tailwind doesn't expose pseudo-elements, so we use a tiny
        inline <style> or a custom CSS class. The cleanest approach
        without touching globals is the `[&::before]:` variant below.
      */}
      <Link
        href={postHref}
        className="
          block
          before:content-[''] before:absolute before:inset-0 before:z-0
        "
        aria-label={post.title}
      />

      {/* All card content sits on top of the invisible overlay */}
      <div className="relative z-10 px-4 py-2 pointer-events-none">
        <div className="py-1 flex items-center gap-2">
          {/* Tag links — re-enable pointer events and lift above overlay */}
          <div className="pointer-events-auto relative z-20">
            {displayType === 'user' && <UsernameTag user={post.creator} />}
            {displayType === 'subreddit' && <SubredditTag subreddit={post.subreddit} />}
            {displayType === 'both' && (
              <CombinedTag user={post.creator} subreddit={post.subreddit} />
            )}
          </div>

          <span className="text-sm text-gray-500">
            {formatTimeToNow(new Date(post.createdAt))}
          </span>
        </div>

        <h1 className="px-2 text-lg font-semibold py-1 leading-6">{post.title}</h1>

        <div className="px-2">
          <div
            className="relative text-sm max-h-40 w-full overflow-clip"
            ref={pRef}
          >
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full  dark:from-slate-900" />
            ) : null}
          </div>

          <div className="flex gap-3 py-1">
            <div className="pointer-events-auto relative z-20 inline-block">
              <PostVoteClient
                postId={post.id}
                initialVote={post.currentVote}
                initialVotesAmt={post.votesAmt}
              />
            </div>

            <div className=" relative z-20">
              <CommentAmtDisplay amt={post.commentsAmt} />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}