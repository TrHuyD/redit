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

  if (!subreddit) return notFound()

  return (
    <div className="min-h-screen dark:bg-[#0B1416] grid grid-cols-[16rem_minmax(0,1fr)] ">
      {/* LEFT TAB */}
      <div className="hidden lg:block border-r border-zinc-100">
        <LeftTab joinedSubreddits={[]} recentSubreddits={[]} />
      </div>

      {/* RIGHT COLUMN */}
      <div className="py-6 w-full pl-10">
        {/* HEADER */}
        <SubredditCombinedHeader subreddit={subreddit} />

        {/* CONTENT AREA */}
        <div className="w-full max-w-6xl"> 
          <div className="grid grid-cols-4 ">
            {/* MAIN */}
            <div className="col-span-3 flex flex-col pr-2 ">
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
    </div>
  )
}