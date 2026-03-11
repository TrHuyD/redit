import { User } from "next-auth";
import { Avatar, AvatarFallback } from "../avatar";
import { UserLogo } from "../Icons";
import Image from "next/image"
import {AvatarProps} from '@radix-ui/react-avatar'
interface UserAvatarProps extends AvatarProps {
    user: Pick<User, 'image' | 'name'>
  }
export const UserAvatar = ({user,...props}:UserAvatarProps) => {
    return (
        <Avatar className="h-8 w-8 rounded-full" {...props}>
          {user.image ? (
            <div className="relative h-full w-full overflow-hidden rounded-full">
              <Image
                fill
                src={user.image}
                alt="profile picture"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <AvatarFallback className="rounded-full">
              <span className="sr-only">{user?.name}</span>
              <UserLogo size="sm" />
            </AvatarFallback>
          )}
        </Avatar>
      )
}