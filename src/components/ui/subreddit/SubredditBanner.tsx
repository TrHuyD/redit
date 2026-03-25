import { UserSubredditBaseMd } from "@/types/dto"


interface Props {
  subreddit: UserSubredditBaseMd
}

export function SubredditBanner({ subreddit }: Props) {
  return (
    <div className="h-32 w-full bg-blue-500">
    </div>
  )
}