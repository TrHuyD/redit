import { Subreddit } from "@prisma/client"

export interface SubredditWithMembership extends Subreddit {
  isMember: boolean
  isCreator: boolean
  userCount: number
}