
import { Avatar, AvatarFallback } from "../avatar"
import { UserLogo } from "../Icons"
import Image from "next/image"
import clsx from "clsx"
import { SubRedditDto } from "@/types/subreddit"

type Size = "sm" | "md" | "lg" | "xl"

interface SubredditAvatarProps {
  subreddit: Pick<SubRedditDto, "image" | "name">
  size?: Size
  className?: string
}

const sizeClasses: Record<Size, string> = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
}
const sizePx: Record<Size, number> = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
}
 const iconSizeMap: Record<Size, "sm" | "md" | "lg"> = {
  sm: "sm",
  md: "sm",
  lg: "md",
  xl: "lg",
}

export const SubredditAvatar = ({ subreddit, size = "md", className }: SubredditAvatarProps) => {
  const px = sizePx[size]

  return (
    <div className="relative inline-block">
      <Avatar className={clsx("rounded-full", sizeClasses[size], className)}>
        {subreddit.image ? (
          <div className="relative h-full w-full overflow-hidden rounded-full">
            <Image fill sizes={`${px}px`} src={subreddit.image} alt={`${subreddit.name} avatar`} className="object-cover" referrerPolicy="no-referrer" />
          </div>
        ) : (
          <AvatarFallback className="rounded-full">
            <span className="sr-only">{subreddit.name}</span>
            <UserLogo size={iconSizeMap[size]} />
          </AvatarFallback>
        )}
      </Avatar>
    </div>
  )
}