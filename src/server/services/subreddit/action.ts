import { PostVoteRequestPayload, PostUnVoteRequestPayload, CommentVoteRequestPayload, CommentUnVoteRequestPayload } from "@/lib/validators/post";

import { Result } from "@/lib/Result";
import * as db from "./action-db";
import { Delta as VoteDelta } from "./type";
import { incrCache } from "../cache/util";
import { UserSubredditRequestPayload } from "@/lib/validators/subreddit";



export async function VotePost({ type, postId, userId }: PostVoteRequestPayload): Promise<Result<VoteDelta>> {
  const result = await db.VotePost({ type, postId, userId });
    if(result.ok)
    {
        const key = `post:${postId}:vote`;
        incrCache(key, result.data.delta).catch(err => {console.error("Failed to update cache:", err);});
    }
    return result;
}
export async function UnVotePost({ postId, userId }: PostUnVoteRequestPayload): Promise<Result<VoteDelta>> {
  const result = await db.UnVotePost({ postId, userId });
  if(result.ok)
    {
        const key = `post:${postId}:vote`;
        incrCache(key, result.data.delta).catch(err => {console.error("Failed to update cache:", err);});
    }
  return result;
}

export async function VoteComment({ voteType: type, commentId, userId }: CommentVoteRequestPayload): Promise<Result<VoteDelta>> {
    const result = await db.VoteComment({ voteType: type, commentId, userId });
    if (result.ok) {
      const key = `comment:${commentId}:vote`;
      incrCache(key, result.data.delta).catch(err => {
        console.error("Failed to update comment cache:", err);
      });
    }
    return result;
  }
  
  export async function UnVoteComment({ commentId, userId }: CommentUnVoteRequestPayload): Promise<Result<VoteDelta>> {
    const result = await db.UnVoteComment({ commentId, userId });
    if (result.ok) {
      const key = `comment:${commentId}:vote`;
      incrCache(key, result.data.delta).catch(err => {
        console.error("Failed to update comment cache:", err);
      });
    }
    return result;
  }

  export async function JoinSubreddit(data: UserSubredditRequestPayload): Promise<Result<null>> {
    const result = await db.JoinSubreddit(data);
    if (result.ok) {
        const key = `subreddit:${data.subredditId}:members`;
        incrCache(key, 1).catch(err => {
            console.error("Failed to update subreddit member cache:", err);
        });
    }
    return result;
}

export async function LeaveSubreddit(data: UserSubredditRequestPayload): Promise<Result<null>> {
    const result = await db.LeaveSubreddit(data);
    if (result.ok) {
        const key = `subreddit:${data.subredditId}:members`;
        incrCache(key, -1).catch(err => {
            console.error("Failed to update subreddit member cache:", err);
        });
    }
    return result;
}