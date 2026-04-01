import { User } from "next-auth"
import { Avatar, AvatarFallback } from "../avatar"
import { UserLogo } from "../Icons"
import Image from "next/image"
import { AvatarProps } from "@radix-ui/react-avatar"
import { UserStatusIndicator, UserStatus } from "./UserStatusIndicator"

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "image" | "name">,
  status?: UserStatus
}

export const UserAvatar = ({ user, status="hidden" }: UserAvatarProps) => {
  return (
    <div className={`relative inline-block `} >
      <Avatar className="h-8 w-8 rounded-full" >
        {user.image ? (
          <div className="relative h-full w-full overflow-hidden rounded-full">
            <Image
              fill
              src={user.image.split('?')[0]}
              alt="profile picture"
              className="object-cover" 
              referrerPolicy="no-referrer"
              sizes="32px"
            />
          </div>
        ) : (
          <AvatarFallback className="rounded-full">
            <span className="sr-only">{user?.name}</span>
            <UserLogo size="sm" />
          </AvatarFallback>
        )}
      </Avatar>

      <UserStatusIndicator status={status} />
    </div>
  )
}
