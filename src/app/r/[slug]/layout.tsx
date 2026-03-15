// app/r/[slug]/layout.tsx
import { getSubreddit } from "@/lib/api/Subreddit/GetSubreddit"
import { getAuthToken } from "@/lib/auth"
import { Metadata } from "next"
import { SubredditBanner } from "@/components/ui/subreddit/SubredditBanner"
import { SubredditHeader } from "@/components/ui/subreddit/SubredditHeader"
import { SubredditAbout } from "@/components/ui/subreddit/SubredditAbout"
import { SubredditRules } from "@/components/ui/subreddit/SubredditRules"
import { SubredditModerators } from "@/components/ui/subreddit/SubredditModerators"

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
  const subreddit = await getSubreddit(slug, token?.id)

  return (
    <div className="min-h-screen bg-[#dae0e6] dark:bg-zinc-900">
      <SubredditBanner subreddit={subreddit} />
      <SubredditHeader subreddit={subreddit} />

      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Feed — fills all 3 cols on mobile, 2 on md+ */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-3 w-full">
            {children}
          </div>

          {/* Sidebar */}
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