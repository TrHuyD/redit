export enum SortBy {
    NEW = "new",
    TOP = "top",
    HOT = "hot"
  }
export enum VoteType{
  UPVOTE = 1,
  DOWNVOTE=-1,
}
export type VoteTarget = "post" | "comment"

export enum DeleteType{
  NULL=0,
  COPYRIGHT=1,
  MODERATOR=2,
  USER=3
}

