
import { Avatar, AvatarFallback, iconSizeMap, Size, sizeClasses, sizePx } from "../avatar"
import { UserLogo } from "../Icons"
import Image from "next/image"
import { AvatarProps } from "@radix-ui/react-avatar"
import { UserStatusIndicator, UserStatus } from "./UserStatusIndicator"
import { UserDto } from "@/types/user"
import clsx from "clsx"

interface UserAvatarProps extends AvatarProps {
  user: Pick<UserDto, "image" | "name">
  status?: UserStatus
  size?: Size
  className?: string
}

export const UserAvatar = ({
  user,
  status = "hidden",
  size = "md",
  className,
}: UserAvatarProps) => {
  const px = sizePx[size]

  return (
    <div className="relative inline-block">
      <Avatar className={clsx("rounded-full", sizeClasses[size], className)}>
        {user.image ? (
          <div className="relative h-full w-full overflow-hidden rounded-full">
            <Image
              fill
              src={user.image.split("?")[0]}
              alt="profile picture"
              className="object-cover"
              referrerPolicy="no-referrer"
              sizes={`${px}px`}
            />
          </div>
        ) : (
          <AvatarFallback className="rounded-full">
            <span className="sr-only">{user.name}</span>
            <UserLogo size={iconSizeMap[size]} />
          </AvatarFallback>
        )}
      </Avatar>

      <UserStatusIndicator status={status} />
    </div>
  )
}