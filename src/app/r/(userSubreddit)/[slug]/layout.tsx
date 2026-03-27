
import { getAuthToken } from "@/lib/auth"
import { Metadata } from "next"
import { notFound } from "next/navigation"

import { SubredditLayout } from "../../../../components/ui/subreddit/SubredditLayout"
import { getSubredditUserMD } from "@/server/services/subreddit/loader"
import { getIdnull } from "@/lib/utils"



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
    const subreddit=await getSubredditUserMD(slug,userId)
    if(!subreddit) return notFound()
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