import { User } from "@prisma/client";
import { UserAvatar } from "../user/UserAvatar";
import EntityTag from "../EntityTag";

interface UsernameProp {
  user: Pick<User, "image" | "username" | "name">;
  className?: string;
}

export default function UsernameTag({ user, className }: UsernameProp) {
  return (
    <EntityTag
      href={`/u/${user.username}`}
      avatar={<UserAvatar user={user} className="h-6 w-6" />}
      label={`u/${user.name}`}
      className={className}
    />
  );
}