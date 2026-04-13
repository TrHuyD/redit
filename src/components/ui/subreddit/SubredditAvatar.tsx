
import { Avatar, AvatarFallback, iconSizeMap, Size, sizeClasses, sizePx } from "../avatar"
import { UserLogo } from "../Icons"
import Image from "next/image"
import clsx from "clsx"
import { SubRedditDto } from "@/types/subreddit"
import { Pen } from "lucide-react"

interface SubredditAvatarProps {
  subreddit: Pick<SubRedditDto, "image" | "name">
  size?: Size
  className?: string
}

export const SubredditAvatar = ({ subreddit, size = "md", className }: SubredditAvatarProps) => {
  const px = sizePx[size]

  return (
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
  )
}

export const SubredditAvatarHeader = ({ isAdmin, ...props }: SubredditAvatarProps & { isAdmin?: boolean }) => {
  return (
    <div className="relative inline-flex items-center justify-center group ">
      <SubredditAvatar {...props} />
      {isAdmin && (
        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center ">
          <Pen className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  )
}