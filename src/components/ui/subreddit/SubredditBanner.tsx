import { SubredditWithMembership } from "@/types/subreddit"

interface Props {
  subreddit: SubredditWithMembership
}

export function SubredditBanner({ subreddit }: Props) {
  return (
    <div className="h-32 w-full bg-blue-500">
    </div>
  )
}