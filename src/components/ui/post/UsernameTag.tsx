
import { UserAvatar } from "../user/UserAvatar";
import EntityTag from "../EntityTag";
import { User } from "@prisma/client";

interface UsernameProp {
  user: Pick<User, "image" |  "name" |"id">;
  className?: string;
}

export default function UsernameTag({ user, className }: UsernameProp) {
  return (
    <EntityTag
      href={`/u/${user.id}`}
      avatar={<UserAvatar user={user} className="h-6 w-6" />}
      label={`u/${user.name}`}
      className={className}
    />
  );
}