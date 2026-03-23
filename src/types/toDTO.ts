import { VoteType } from "@/types/enum"
import { ExtendedPost } from "./db"
import { CommentDto, PostUserDto, SubRedditDto, UserDto } from "./dto"

export function toUserDto(user: {
    id: bigint
    name: string | null
    image: string | null
}): UserDto {
    return {
        id: user.id,
        name: user.name ?? '',
        image: user.image ?? '',
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
        votesAmt,
        currentVote,
        content: post.content,
        title: post.title,
        commentsAmt: post.comments.length,
        createdAt: post.createdAt,
        lastEdited: post.latestUpdateAt ?? null,
    }
}
function getVoteAmt(votes: { type: number }[]) {
    return votes.reduce((acc, v) => acc + v.type, 0)
  }
function toCommentDto(comment: any): CommentDto {
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      latestUpdateAt: comment.latestUpdateAt,
      author: {
        id: comment.author.id,
        username: comment.author.username,
        avatarUrl: comment.author.avatarUrl,
      },
      voteAmt: getVoteAmt(comment.votes ?? []),
      replies: (comment.replies ?? []).map(toReplyDto), // only 1 level
    }
  }
function toReplyDto(reply: any): CommentDto {
    return {
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt,
        latestUpdateAt: reply.latestUpdateAt,
        author: {
        id: reply.author.id,
        username: reply.author.username,
        avatarUrl: reply.author.avatarUrl,
        },
        voteAmt: getVoteAmt(reply.votes ?? []),
        replies: [],
    }
}