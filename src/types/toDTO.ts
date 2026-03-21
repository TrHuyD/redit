import { VoteType } from "@prisma/client"
import { ExtendedPost } from "./db"
import { PostDto, SubRedditDto, UserDto } from "./dto"

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

export function toPostDto(post: ExtendedPost, currentUserId?: bigint): PostDto {
    const votesAmt = post.votes.reduce((acc, vote) => {
        if (vote.type === VoteType.UPVOTE) return acc + 1
        if (vote.type === VoteType.DOWNVOTE) return acc - 1
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