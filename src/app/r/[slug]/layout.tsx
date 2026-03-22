// app/r/[slug]/layout.tsx
import { getSubredditWithMembership } from "@/server/services/subreddit/Get"
import { getAuthToken } from "@/lib/auth"
import { Metadata } from "next"

import { SubredditAbout } from "@/components/ui/subreddit/SubredditAbout"
import { SubredditRules } from "@/components/ui/subreddit/SubredditRules"
import { SubredditModerators } from "@/components/ui/subreddit/SubredditModerators"

import { notFound } from "next/navigation"
import { getId } from "@/lib/utils"
import { SubredditCombinedHeader } from "@/components/ui/subreddit/SubredditCombinedBanner"
import { LeftTab } from "@/components/ui/subreddit/LeftTab"

export const metadata: Metadata = {
  title: "Redit",
  description: "Abc",
}

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}
export default async function Layout({ children, params }: LayoutProps) {
  const { slug } = await params
  const token = await getAuthToken()
  const subreddit = await getSubredditWithMembership(
    slug,
    token ? getId(token) : undefined
  )

  if (subreddit === null) return notFound()

  return (
    <div className="min-h-screen dark:bg-[#0B1416] grid grid-cols-[16rem_1fr]">

      <div className="hidden lg:block border-r border-zinc-200">
        <LeftTab joinedSubreddits={[]} recentSubreddits={[]} />
      </div>

      <div>
        {/* HEADER */}
        <SubredditCombinedHeader subreddit={subreddit} />

        {/* CONTENT AREA */}
        <div className="max-w-6xl mx-auto py-6">
          <div className="grid grid-cols-4">

            {/* MAIN */}
            <div className="col-span-3 flex flex-col pr-2 gap-4">
              {children}
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="hidden lg:block col-1">
              <div className="sticky top-14 self-start flex flex-col gap-4">
                <SubredditAbout subreddit={subreddit} />
                <SubredditRules subreddit={subreddit} />
                <SubredditModerators subreddit={subreddit} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}