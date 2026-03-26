
import CreatePostButton from "@/components/post/CreatePostButton"
import { Users, Circle } from "lucide-react"

import { formatTimeToNow } from "@/lib/utils"
import { UserSubredditBaseMd } from "@/types/subreddit"



interface Props {
  subreddit: UserSubredditBaseMd
}

export function SubredditAbout({ subreddit }: Props) {
  const { name } = subreddit
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      <div className="bg-blue-500 px-4 py-3">
        <p className="text-white font-bold text-sm">About Community</p>
      </div>

      <div className="p-3 flex flex-col gap-3">
        {/* TODO: subreddit.description */}
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Community description goes here.
        </p>

        <div className="flex gap-6 pt-2 border-t border-zinc-200 dark:border-zinc-700">
          <div>
            {/* TODO: subreddit.memberCount */}
            <p className="font-bold text-sm text-zinc-900 dark:text-white">{subreddit.userCount}</p>
            <p className="text-xs text-zinc-500 flex items-center gap-1">
              <Users className="w-3 h-3" /> Members
            </p>
          </div>
          <div>
            {/* TODO: subreddit.onlineCount */}
            <p className="font-bold text-sm text-zinc-900 dark:text-white">0</p>
            <p className="text-xs text-zinc-500 flex items-center gap-1">
              <Circle className="w-3 h-3 fill-green-500 stroke-green-500" /> Online
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
          {/* TODO: subreddit.createdAt */}
          <p className="text-xs text-zinc-500">Created {formatTimeToNow(BigInt(subreddit.createdAt))}</p>
          <CreatePostButton />
        </div>
      </div>
    </div>
  )
}