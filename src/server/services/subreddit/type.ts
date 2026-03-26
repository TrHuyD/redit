export interface Delta{
  delta:number
}

export interface VoteScore{
    Id:bigint,
    Count:number
}

export interface UserVote {
  Id: bigint,
  type: number
}