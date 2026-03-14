import { cn } from "@/lib/utils"
import { Moon } from "lucide-react"

export type UserStatus = "online" | "offline" | "busy" | "away" | "hidden"

interface UserStatusIndicatorProps {
  status?: UserStatus
  className?: string
}

export function UserStatusIndicator({
  status = "offline",
  className,
}: UserStatusIndicatorProps) {
  if (status === "hidden") return null

  const base =
    "absolute bottom-0 right-0 flex items-center justify-center rounded-full w-3.5 h-3.5 border-2 border-zinc-900"

  switch (status) {
    case "online":
      return <span className={cn(base, "bg-green-500", className)} />

    case "offline":
      return (
        <span
          className={cn(
            base,
            "bg-zinc-700 border-zinc-900 flex items-center justify-center",
            className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
        </span>
      )

    case "busy":
      return (
        <span className={cn(base, "bg-red-500", className)}>
          <span className="w-2 h-[2px] bg-white rounded" />
        </span>
      )

    case "away":
      return (
        <span className={cn(base, "bg-yellow-400", className)}>
          <Moon className="w-2 h-2 text-zinc-900" />
        </span>
      )
  }
}