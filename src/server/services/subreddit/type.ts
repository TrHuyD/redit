export interface Delta{
  delta:number,
  id:bigint,
  date:Date
}

export interface VoteScore{
    id:bigint,
    Count:number
}

export interface UserVote {
  id: bigint,
  type: number
}