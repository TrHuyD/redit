export interface Delta{
  delta:number,
  Id:bigint,
  date:Date
}

export interface VoteScore{
    Id:bigint,
    Count:number
}

export interface UserVote {
  Id: bigint,
  type: number
}