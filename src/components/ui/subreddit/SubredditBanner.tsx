import { UserSubredditBaseMd } from "@/types/subreddit"



interface Props {
  subreddit: UserSubredditBaseMd
}

export function SubredditBanner({ subreddit }: Props) {
  return (
    <div className="h-32 w-full bg-blue-500 rounded-md">
    </div>
  )
}