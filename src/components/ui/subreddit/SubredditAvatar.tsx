import { Subreddit } from "@prisma/client"
import { Avatar, AvatarFallback } from "../avatar"
import { UserLogo } from "../Icons"
import Image from "next/image"
import { AvatarProps } from "@radix-ui/react-avatar"

interface SubredditAvatarProps extends AvatarProps {
  subreddit: Pick<Subreddit, "image" | "name">
}

export const SubredditAvatar = ({ subreddit, ...props }: SubredditAvatarProps) => {
  return (
    
    <div className="relative inline-block">
      <Avatar className="h-8 w-8 rounded-full" {...props}>
        {subreddit.image ? (
          <div className="relative h-full w-full overflow-hidden rounded-full">
            <Image
              fill
              src={subreddit.image}
              alt="profile picture"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <AvatarFallback className="rounded-full" {...props}>
            <span className="sr-only">{subreddit?.name}</span>
            <UserLogo size="sm" />
          </AvatarFallback>
        )}
      </Avatar>

    </div>
  )
}
