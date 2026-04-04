import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { db } from "@/lib/db"

import { cache } from "react"
import { notFound } from "next/navigation"
import { ID } from "@/types/ID"
import { toPostDto, toPostPerDto } from "@/types/toDTO"


export const isMember=cache(async (subredditId:bigint,userId?:bigint) =>{
  if(!userId)
    return false;
  const sub = await db.subscription.findUnique({where: {userId_subredditId:{userId,subredditId}}})
  return sub!=null
})

export const getSubreddit = cache(async (slug: string) => {
  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
  })

  if (!subreddit) notFound()
  return  subreddit
})



export async function getSubredditPosts({
  slug,
  orderBy = "desc",
  take = INFINITE_SCROLLING_PAGINATION_RESULTS,
  cursor,
  userId,
}: {
  slug: string
  orderBy?: "asc" | "desc"
  take?: number
  cursor?: bigint | number 
  userId?: ID
}) {
  const subreddit = await getSubreddit(slug)
  if (!subreddit) return null
  const _posts = await db.post.findMany({
    where: { subredditId: subreddit.id },
    include: {
      author: true,
      votes: true,
      comments: true,
    },
    orderBy: { id: orderBy },
    take :take,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
  })

  const posts = _posts.map(post => ({
    ...post,
    subreddit,
  }))

  return { subId:subreddit.id,posts:posts.map(a => toPostDto(a,userId))}
}
  
  
  
  
  export async function getFeedPosts({
    userId,
    orderBy = "desc",
    take = INFINITE_SCROLLING_PAGINATION_RESULTS,
    cursor,
  }: {
    userId: ID
    orderBy?: "asc" | "desc"
    take?: number
    cursor?: bigint | number
  }) {
    const subscriptions = await db.subscription.findMany({
      where: { userId },
      select: { subredditId: true },
    })

    const subredditIds = subscriptions.map(s => s.subredditId)
    if (subredditIds.length === 0) return []
    const _posts = await db.post.findMany({
      where: {
        subredditId: { in: subredditIds },
      },
      include: {
        author: true,
        votes: true,
        comments: true,
        subreddit: true,
      },
      orderBy: { id: orderBy },
      take,
      ...(cursor !== undefined && {
        cursor: { id: cursor },
        skip: 1,
      }),
    })
    return _posts.map(post => toPostDto(post, userId))
  }

  export async function getAllPosts({
    userId,
    orderBy = "desc",
    take = INFINITE_SCROLLING_PAGINATION_RESULTS,
    cursor,
  }: {
    userId?: ID
    orderBy?: "asc" | "desc"
    take?: number
    cursor?: bigint | number
  }) {
  

    const _posts = await db.post.findMany({
      include: {
        author: true,
        votes: true,
        comments: true,
        subreddit: true,
      },
      orderBy: { id: orderBy },
      take,
      ...(cursor !== undefined && {
        cursor: { id: cursor },
        skip: 1,
      }),
    })
    return _posts.map(post => toPostDto(post, userId))
  }


export async function getPost({
  postId,
  userId,
}: {
  postId: ID
  userId?: ID
}) {
  const post = await db.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
      votes: true,
      comments: true,
      subreddit: true,
    },  
  })

  if (!post) return null

  return toPostDto(post, userId)
}
function getVoteAmt(votes: { type: number }[]) {
  return votes.reduce((acc, v) => acc + v.type, 0)
}
async function rawComments({ postId }: { postId: ID }) {
  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null,
    },
    orderBy: { createdAt: "desc" },
  })

  if (comments.length === 0) return [] 
  return db.comment.findMany({
    where: { id: { in: comments.map(c => c.id) } }, 
    include: {
      author: { select: { id: true, name: true, image: true } },
      votes: true,
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true, image: true } },
          votes: true,
        },
      },
    },
  })
}
export async function getComments({postId,userId=undefined}:{postId:ID,userId?:ID}){
  const comments = await rawComments({postId})
  return comments.map((c) => toPostPerDto(c, userId))
}