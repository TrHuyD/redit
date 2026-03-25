
import { getAuthToken } from "@/lib/auth"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getId, getIdnull } from "@/lib/utils"
import { SubredditLayout } from "../../../../components/ui/subreddit/SubredditLayout"
import { getSubredditId, getSubredditMemberCount, getSubredditMetadata } from "@/server/services/subreddit/md"
import { isMember } from "@/server/services/subreddit/Get"


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
  const userId = getIdnull(token)
  const isAll = slug === "all"

  if(!isAll)
  {
    const id = await getSubredditId(slug)
    if(!id) return notFound()
    const [subredditMd, memberCount,isMem] = await Promise.all([
      getSubredditMetadata(id),
      getSubredditMemberCount(id),
      isMember(id,userId),
    ])
    const subreddit= {...subredditMd!,userCount:memberCount!,isCreator:subredditMd?.creatorId==userId,isMember:isMem}
    return (
    <div className="min-h-screen dark:bg-[#0B1416] ">
      <SubredditLayout subreddit={subreddit}>
          {children}
        </SubredditLayout>
    </div>
    )
  }

  return (
    <div className="min-h-screen dark:bg-[#0B1416] ">
         <div className="w-full pl-10">
          {children}
        </div>
    </div>
  )
}