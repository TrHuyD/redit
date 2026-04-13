"use client"

import { Hover, useHoverData } from "@/components/Hover"
import { UserProfileDto } from "@/types/Users/dto"
import { UserAvatar } from "./UserAvatar"



async function fetchUser(userId: bigint): Promise<UserProfileDto> {
  const res = await fetch(`/api/user/hover?userId=${userId}`)
  if (!res.ok) throw new Error("Failed to fetch user")
  return res.json()
}

function HoverUserContent() {
  const { data, isLoading } = useHoverData<UserProfileDto>()
  if (isLoading) return <div className="text-sm">Loading...</div>
  if (!data) return <div className="text-sm text-gray-500">No data</div>
  return (
    <div className="flex gap-3">
      <UserAvatar user={data}/>
      <div>
        <div className="font-semibold">{data.name}</div>
        {/* <div className="text-sm text-gray-500">{data.bio}</div>
        <div className="text-xs">⭐ {data.score}</div> */}
      </div>
    </div>
  )
}
export function HoverUser({ userId, children }: { userId: bigint; children: React.ReactNode }) {
  return <Hover queryKey={["user-hover", userId.toString()]} queryFn={() => fetchUser(userId)} content={<HoverUserContent />}>{children}</Hover>
}