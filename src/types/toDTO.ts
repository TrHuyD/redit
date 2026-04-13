import { VoteType } from "@/types/enum"
import { ExtendedComment, ExtendedPost } from "./db"
import { CommentDto, CommentPerDto, } from "./dto"
import { ID } from "./ID"

import { UserDto } from "./Users/dto"
import { PostUserDto } from "./post"
import { SubRedditDto } from "./subreddit"

export function toUserDto(user: {
    id: bigint
    name: string 
    image: string
    username:string 
}): UserDto {
    return {
        id: user.id,
        name: user.name ?? '',
        image: user.image ?? '',
        username:user.username
    }
}

export function toSubRedditDto(subreddit: {
    id: bigint
    name: string
    image: string | null
}): SubRedditDto {
    return {
        id: subreddit.id,
        name: subreddit.name,
        image: subreddit.image ?? '',
    }
}

export function toPostDto(post: ExtendedPost, currentUserId?: bigint): PostUserDto {
    const votesAmt = post.votes.reduce((acc, vote) => {
        acc+=vote.type
        return acc
    }, 0)

    const currentVote = currentUserId
        ? post.votes.find(vote => vote.userId === currentUserId)?.type ?? null
        : null

    return {
        id: post.id,
        creator: toUserDto(post.author),
        subreddit: toSubRedditDto(post.subreddit),
        stat:{commentsAmt: post.comments.length,votesAmt,date:post.createdAt.getTime()},
        currentVote,
        content: post.content,
        title: post.title,
        createdAt: post.createdAt,
        lastEdited: post.latestUpdateAt ?? null,
    }
}
function getVoteAmt(votes: { type: number }[]) {
    return votes.reduce((acc, v) => acc + v.type, 0)
  }
function getVoteType(
votes: { type: number; userId?: ID }[],
userId?: ID
): VoteType | undefined {
if (!userId) return undefined

const vote = votes.find((v) => v.userId === userId)
return vote?.type as VoteType | undefined
}

export function toCommentDto(comment: ExtendedComment): CommentDto {
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      latestUpdateAt: comment.latestUpdateAt,
      author: comment.author,
      voteAmt: getVoteAmt(comment.votes ?? []),
      replies: (comment.replies ?? []).map(toReplyDto), // only 1 level
    }
  }
function toReplyDto(reply: ExtendedComment): CommentDto {
    return {
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt,
        latestUpdateAt: reply.latestUpdateAt,
        author: reply.author,
        voteAmt: getVoteAmt(reply.votes ?? []),
        replies: [],
    }
}
export function toPostPerDto(comment: ExtendedComment, userId?: ID): CommentPerDto {
    const dto = toCommentDto(comment)
    let currentVote ;
    if(userId)
    { 
        currentVote= comment.votes?.find((v) => v.userId === userId)?.type
    }
    return {
      ...dto,
      voteType:currentVote,
      replies:  comment.replies?.map((r) => ({
        ...toReplyDto(r),
        voteType: userId
          ? r.votes?.find((v) => v.userId === userId)?.type ?? null
          : null,
      })),
    }
  }