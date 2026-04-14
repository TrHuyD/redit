import { UserSubredditBaseMd } from "@/types/subreddit";
import { Pen } from "lucide-react";
import Image from "next/image";
import { Button } from "../button";


interface Props {
  subreddit: UserSubredditBaseMd
}

export function SubredditBanner({ subreddit }: Props) {
  return <div className="group relative">
  {subreddit.bannerImage ? (
    <div className="h-32 w-full relative rounded-md overflow-hidden">
      <Image src={subreddit.bannerImage} alt="Banner" className="object-cover w-full h-full" fill />
    </div>
  ) : (
    <div className="h-32 w-full bg-blue-500 rounded-md"></div>
  )}
    {subreddit.isCreator && (
    <Button className="absolute bottom-2 right-2 transition p-2 rounded-md" variant={"default"}>
      <Pen className="w-4 h-4 " />
    </Button>
  )}
</div>
}