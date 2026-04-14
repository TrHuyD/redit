"use client"

import { Hover, useHoverData } from "@/components/Hover"
import { CakeSliceIcon } from "lucide-react"
import { LoadingSpinner } from "../LoadSpiner"
import { SubredditCompeteMd } from "@/types/subreddit"
import { SubredditAvatar } from "./SubredditAvatar"
import Image from "next/image"
import { Button } from "../button"


async function fetchPost(id: bigint): Promise<SubredditCompeteMd> {
  const res = await fetch(`/api/subreddit/hover?subredditId=${id}`)
  console.log(res)
  if (!res.ok) throw new Error("Failed to fetch user")
  return res.json()
}
function HoverContent() {
  const { data, isLoading } = useHoverData<SubredditCompeteMd>()
  if (isLoading) return <LoadingSpinner/>
  if (!data) return <div className="text-sm text-gray-500">No data</div>
  const date= new Date(Number(data.createdAt)).toLocaleString()
  
  return (
    <div className="rounded-lg border border-border overflow-hidden bg-background">
      {data.bannerImage ? (
        <div className="w-full h-24 relative overflow-hidden">
          <Image src={data.bannerImage} alt="Banner" className="object-cover w-full h-full" fill />
        </div>
      ) : (
        <div className="w-full h-24 bg-gradient-to-br from-blue-400 to-blue-700" />
      )}
  
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 pt-2">
          <div className="border-[3px] border-background rounded-full flex-shrink-0">
            <SubredditAvatar subreddit={data} size="lg" />
          </div>
          <div className="flex flex-1 justify-between items-center min-w-0">
            <span className="text-sm font-medium truncate">{`r/${data.name}`}</span>
            <Button variant="outline" size="sm" className="rounded-full flex-shrink-0">Join</Button>
          </div>
        </div>
  
        <p className="text-xs text-muted-foreground mt-2 mb-3 leading-relaxed">
          {data.description || `A community for r/${data.name} users`}
        </p>
  
        <div className="flex gap-6 border-t border-border pt-2">
          <div>
            <p className="text-sm font-medium">placeholder</p>
            <p className="text-xs text-muted-foreground">Weekly visitors</p>
          </div>
          <div>
            <p className="text-sm font-medium">placeholder</p>
            <p className="text-xs text-muted-foreground">Weekly contributions</p>
          </div>
        </div>
      </div>
    </div>
  )
}
export function HoverSubreddit({ subId, children }: { subId: bigint; children: React.ReactNode }) {
  return <Hover className="p-0 w-96" queryKey={["user-hover", subId.toString()]} queryFn={() => fetchPost(subId)} content={<HoverContent />}>{children}</Hover>
}