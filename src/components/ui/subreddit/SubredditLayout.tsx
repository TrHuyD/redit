// components/ui/subreddit/SubredditLayout.tsx
import { SubredditAbout } from "@/components/ui/subreddit/SubredditAbout"
import { SubredditRules } from "@/components/ui/subreddit/SubredditRules"
import { SubredditModerators } from "@/components/ui/subreddit/SubredditModerators"
import { SubredditCombinedHeader } from "@/components/ui/subreddit/SubredditCombinedBanner"
import { UserSubredditBaseMd } from "@/types/subreddit"


interface SubredditLayoutProps {
  children: React.ReactNode
  subreddit: UserSubredditBaseMd
}

export function SubredditLayout({ children, subreddit }: SubredditLayoutProps) {
  return (
    <div className="w-full pl-10">
      <SubredditCombinedHeader subreddit={subreddit} />

      <div className="w-full max-w-6xl">
        <div className={`grid grid-cols-4`}>
          {/* MAIN */}
          <div className={`flex flex-col pr-2  col-span-3 `}>
            {children}
          </div>

          {/* RIGHT SIDEBAR */}
         
            <div className="hidden lg:block col-span-1">
              <div className="sticky top-14 self-start flex flex-col gap-4">
                <SubredditAbout subreddit={subreddit} />
                <SubredditRules subreddit={subreddit} />
                <SubredditModerators subreddit={subreddit} />
              </div>
            </div>
         
        </div>
      </div>
    </div>
  )
}