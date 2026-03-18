import { Subreddit } from "@prisma/client";
import { SubredditAvatar } from "../subreddit/SubredditAvatar";
import EntityTag from "../EntityTag";

interface SubredditTagProps {
  subreddit: Pick<Subreddit, "image" | "name">;
  className?: string;
}

export default function SubredditTag({ subreddit, className }: SubredditTagProps) {
  return (
    <EntityTag
      href={`/r/${subreddit.name}`}
      avatar={<SubredditAvatar subreddit={subreddit} className="h-6 w-6" />}
      label={`r/${subreddit.name}`}
      className={className}
    />
  );
}