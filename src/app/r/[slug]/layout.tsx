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
  const subreddit = await getSubredditWithMembership(slug, token ?getId(token):undefined)
  if(subreddit === null) { return notFound() }
  return (
    <div className="min-h-screen ">
      <SubredditCombinedHeader subreddit={subreddit}/>
      <div className=" mx-auto px-4 py-5 dark:bg-[#0B1416]">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          <div className="col-span-1 md:col-span-4 flex flex-col gap-3 w-full">
            {children}
          </div>

          <div className="hidden md:flex flex-col gap-4">
            <SubredditAbout subreddit={subreddit} />
            <SubredditRules subreddit={subreddit} />
            <SubredditModerators subreddit={subreddit} />
          </div>

        </div>
      </div>
    </div>
  )
}