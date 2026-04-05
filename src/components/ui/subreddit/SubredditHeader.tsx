// components/subreddit/SubredditHeader.tsx

import CreatePostButton from "@/components/post/CreatePostButton"
import { SubscribeLeaveToggle } from "@/components/ui/subreddit/SubscribeLeaveToggle"

import { SubredditAvatar } from "./SubredditAvatar"
import { Button } from "../button"
import { UserSubredditBaseMd } from "@/types/subreddit"



interface Props {
  subreddit: UserSubredditBaseMd
}

export function SubredditHeader({ subreddit }: Props) {
  const { name } = subreddit
  // if(IsInAPost())  {
  //   return null
  // }
  return (
    <div className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 shadow-sm">
      <div className="max-w-5xl  px-4 flex items-end gap-4 pb-3">

        {/* Community icon */}
        <div className="w-[72px] h-[72px] rounded-full border-4 border-white dark:border-zinc-800 bg-blue-500 flex items-center justify-center -mt-4 shrink-0 overflow-hidden">
          <SubredditAvatar subreddit={subreddit} className="w-[72px] h-[72px]" />
        </div>

        {/* Name + actions */}
        <div className="flex flex-1 items-center justify-between flex-wrap gap-3 pb-1">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            r/{name}
          </h1>
          <div className="flex items-center gap-2">
            <SubscribeLeaveToggle subreddit={subreddit} />
            <CreatePostButton />
            <Button className="border border-zinc-300 dark:border-zinc-600 rounded-full px-3 py-1.5 text-sm font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700">
              ···
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}