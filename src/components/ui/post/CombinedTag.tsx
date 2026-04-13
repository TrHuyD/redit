
import Link from "next/link";
import { SubredditAvatar } from "../subreddit/SubredditAvatar";
import { SubRedditDto } from "@/types/subreddit";
import { UserDto } from "@/types/Users/dto";

interface CombinedTagProps {
  subreddit:SubRedditDto
  user: UserDto
  className?: string;
}

export default function CombinedTag({ subreddit, user }: CombinedTagProps) {
  return (
    <div className="flex items-center gap-2
      px-2 py-1 rounded-full
      bg-transparent hover:bg-white/5
      ring-1 ring-transparent hover:ring-white/10
      transition-all duration-200">

      <Link href={`/r/${subreddit.name}`} className="relative z-20" prefetch={false}>
        <SubredditAvatar subreddit={subreddit} className="h-8 w-8" />
      </Link>

      <div className="flex flex-col">
        <Link
          prefetch={false}
          href={`/r/${subreddit.name}`}
          className="relative z-20 text-zinc-800 hover:text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-600 text-xs font-medium leading-tight">
          r/{subreddit.name}
        </Link>
        <Link
          prefetch={false}
          href={`/u/${user.username}`}
          className="relative z-20 text-xs text-muted-foreground leading-tight">
          u/{user.name}
        </Link>
      </div>
    </div>
  );
}