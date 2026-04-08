import { UserSubredditBaseMd } from "@/types/subreddit"
import { AspectRatio } from "../aspect-ratio"
import Image from "next/image";


interface Props {
  subreddit: UserSubredditBaseMd
}

export function SubredditBanner({ subreddit }: Props) {
  return subreddit.bannerImage ? (
    <div className="h-32 w-full relative rounded-md overflow-hidden">
      <Image src={subreddit.bannerImage} alt="Banner" className="object-cover w-full h-full" fill />
    </div>
  ) : (
    <div className="h-32 w-full bg-blue-500 rounded-md"></div>
  );
}