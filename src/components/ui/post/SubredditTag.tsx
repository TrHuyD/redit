
import { SubredditAvatar } from "../subreddit/SubredditAvatar";
import {EntityTag, EntityTagDes} from "../EntityTag";
import { SubredditBaseMd, SubRedditDto } from "@/types/subreddit";

interface SubredditTagProps {
  subreddit: SubRedditDto
  className?: string;
}

export  function SubredditTag({ subreddit, className }: SubredditTagProps) {
  return (
    <EntityTag
      href={`/r/${subreddit.name}`}
      avatar={<SubredditAvatar subreddit={subreddit} className="h-6 w-6" />}
      label={`r/${subreddit.name}`}
      className={className}
    />
  );
}
interface SubredditDesTagProps {
  subreddit: SubredditBaseMd;
  className?: string;
  onClick?: () => void;
}
export  function SubredditDes( props: SubredditDesTagProps) {
  return (
    <EntityTagDes
      onClick={() => props.onClick?.()}
      avatar={<SubredditAvatar subreddit={props.subreddit} size="md" />}
      label={`r/${props.subreddit.name}`}
      description={props.subreddit.description|| `Community for ${props.subreddit.name}`}
      className={props.className}
      />
  );
}