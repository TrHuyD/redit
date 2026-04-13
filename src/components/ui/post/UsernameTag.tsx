'use client'
import { UserAvatar } from "../user/UserAvatar";
import {EntityTag} from "../EntityTag";
import { UserDto } from "@/types/user";
import { HoverUser } from "../user/HoverUser";

interface UsernameProp {
  user:UserDto;
  className?: string;
}

export default function UsernameTag({ user, className }: UsernameProp) {
  return (
    <HoverUser userId={user.id}>
      <span>
    <EntityTag
      href={`/u/${user.username}`}
      avatar={<UserAvatar user={user} size="md" />}
      label={`u/${user.name}`}
      className={className}
    />
    </span> 
    </HoverUser>
  );
}