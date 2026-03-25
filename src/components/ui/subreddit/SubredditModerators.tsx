import { UserSubredditBaseMd } from "@/types/dto"


interface Props {
    subreddit: UserSubredditBaseMd
  }
  
  export function SubredditModerators({ subreddit }: Props) {
    return (
      <div className="bg-white dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <p className="font-bold text-sm text-zinc-900 dark:text-white">Moderators</p>
        </div>
        <div className="p-3 flex flex-col gap-1">
          {/* TODO: map over subreddit.moderators */}
          {["mod_username", "another_mod"].map((mod) => (
            <div key={mod} className="flex items-center gap-2 px-1 py-1.5">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[11px] font-bold text-blue-600 dark:text-blue-300">
                u
              </div>
              <span className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                u/{mod}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }