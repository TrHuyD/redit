
import { getSubredditWithMembership } from "@/server/services/subreddit/Get"
import { getAuthToken } from "@/lib/auth"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getId } from "@/lib/utils"
import { SubredditLayout } from "../../../../components/ui/subreddit/SubredditLayout"


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

  const isAll = slug === "all"

  const subreddit = isAll
    ? null
    : await getSubredditWithMembership(slug, token ? getId(token) : undefined)

  if (!isAll && !subreddit) return notFound()

  return (
    <div className="min-h-screen dark:bg-[#0B1416] ">
     
      {subreddit ? (
        <SubredditLayout subreddit={subreddit}>
          {children}
        </SubredditLayout>
      ) : (
        <div className="w-full pl-10">
          {children}
        </div>
      )}
    </div>
  )
}