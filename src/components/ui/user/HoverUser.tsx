"use client"

import { Hover, useHoverData } from "@/components/Hover"
import { UserProfileDto } from "@/types/user"
import { UserAvatar } from "./UserAvatar"
import { CakeSliceIcon, MessageCircleIcon, PlusCircleIcon } from "lucide-react"
import { LoadingSpinner } from "../LoadSpiner"
import { Button } from "../button"



async function fetchUser(userId: bigint): Promise<UserProfileDto> {
  const res = await fetch(`/api/user/hover?userId=${userId}`)
  if (!res.ok) throw new Error("Failed to fetch user")
  return res.json()
}

function HoverUserContent() {
  const { data, isLoading } = useHoverData<UserProfileDto>()
  if (isLoading) return <LoadingSpinner/>
  if (!data) return <div className="text-sm text-gray-500">No data</div>
  const date= new Date(data.createdAt).toLocaleString()
  return (
    <div className="flex flex-col gap-3 p-3 w-70">
      <div className="flex gap-3 items-start">
        <UserAvatar user={data} size="lg" className="rounded-md" />
        <div>
          <div className="text-sm font-semibold">{data.name}</div>
          <div className="text-xs text-muted-foreground">{`u/${data.username}`}</div>
          <div className="text-xs text-muted-foreground flex gap-1 items-center">
            <CakeSliceIcon className="w-3 h-3" />
            <span>{date}</span>
          </div>
        </div>
      </div>
  
      <div className="flex gap-5 py-2 border-y border-border">
        <div>
          <div className="text-sm font-semibold">
            {/* {data.postKarma} */}
            PHH
            </div>
          <div className="text-xs text-muted-foreground">Post karma</div>
        </div>
        <div>
          <div className="text-sm font-semibold">
            {/* {data.commentKarma} */}
            PHH
          </div>
          <div className="text-xs text-muted-foreground">Comment karma</div>
        </div>
      </div>
  
      {/* <div>
        <div className="text-xs font-semibold mb-2">r/placeholder achievements</div>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[0,1,2].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-muted border border-border -ml-2 first:ml-0" />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Achievement one, Achievement two</span>
        </div>
        <div className="text-xs text-blue-500 mt-2 cursor-pointer">View your achievements</div>
      </div> */}
  
      <div className="border-t border-border pt-2">
        {/* <div className="text-xs text-blue-500 mb-2 cursor-pointer">What is karma?</div> */}
        <div className="flex gap-2">
          <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white gap-1" disabled={true}>
            <PlusCircleIcon className="w-3.5 h-3.5" /> Follow
          </Button>
          <Button size="sm" variant="outline" className="rounded-full gap-1" disabled={true}>
            <MessageCircleIcon className="w-3.5 h-3.5" /> Start Chat
          </Button>
        </div>
      </div>
    </div>
  )
}
export function HoverUser({ userId, children }: { userId: bigint; children: React.ReactNode }) {
  return <Hover queryKey={["user-hover", userId.toString()]} queryFn={() => fetchUser(userId)} content={<HoverUserContent />}>{children}</Hover>
}