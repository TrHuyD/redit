import { UserSubredditBaseMd } from "@/types/subreddit"

interface Props {
  subreddit: UserSubredditBaseMd
}

export function SubredditRules({ subreddit }: Props) {
  const { name } = subreddit

  return (
    <div className="bg-white  dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
        <p className="font-bold text-sm text-zinc-900 dark:text-white">
          R/{name} Rules
        </p>
      </div>
      <div className="divide-y divide-zinc-100 dark:divide-zinc-700">
        {/* TODO: map over subreddit.rules */}
        {["Respect others and be civil", "No spam", "Rule three placeholder"].map(
          (rule, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3 text-sm  dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 cursor-pointer"
            >
              <span>{i + 1}. {rule}</span>
              <span className="text-zinc-400">›</span>
            </div>
          )
        )}
      </div>
    </div>
  )
}