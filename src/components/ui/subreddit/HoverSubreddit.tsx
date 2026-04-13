"use client"

import { Hover, useHoverData } from "@/components/Hover"
import { CakeSliceIcon } from "lucide-react"
import { LoadingSpinner } from "../LoadSpiner"
import { SubredditCompeteMd } from "@/types/subreddit"
import { SubredditAvatar } from "./SubredditAvatar"



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
    <div className="flex gap-3 font-semibold">
      <SubredditAvatar subreddit={data} size="lg"/>
      <div>
        <div className=" text-base">{data.name}</div>
        <div className="text-sm text-gray-500 flex gap-2 items-center">
            <CakeSliceIcon className="w-4 h-4"/> 
            <span title={date}>
                {date}
            </span></div>
        {/* <div className="text-sm text-gray-500">{data.bio}</div>
        <div className="text-xs">⭐ {data.score}</div> */}
      </div>
    </div>
  )
}
export function HoverSubreddit({ subId, children }: { subId: bigint; children: React.ReactNode }) {
  return <Hover queryKey={["user-hover", subId.toString()]} queryFn={() => fetchPost(subId)} content={<HoverContent />}>{children}</Hover>
}