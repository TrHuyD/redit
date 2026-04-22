import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileDto } from "@/types/user";
interface ProfileHeaderProps {
  user:UserProfileDto
}

export function ProfileHeader({ user}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-4">
      {/* Identity row */}
      <div className="flex items-center gap-3">
        <Avatar className="w-14 h-14 border-2 border-background shadow-sm">
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback className="text-lg font-semibold">{user.name[0].toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <span className="text-2xl font-bold text-foreground leading-tight">{user.username}</span>
          <span className="text-sm text-muted-foreground">u/{user.name}</span>
        </div>
      </div>
      </div>

  );
}
