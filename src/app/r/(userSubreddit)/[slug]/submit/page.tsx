import { getSubreddit } from "@/server/services/subreddit/Get"
import { notFound } from "next/navigation"
import  Editor  from "@/components/ui/Editor"
import { SubredditSelector } from "../../../../../components/ui/subreddit/SubredditSelector"
import { Button } from "@/components/ui/Button"
interface PageProps {
    params: Promise<{
      slug: string
    }>
  }
  
  export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const subreddit = await getSubreddit(slug)
    if(!subreddit)
        return notFound()
    return (
      <div className="flex flex-col items-start gap-6 w-full max-w-3xl">
        <SubredditSelector slug={slug} initialImage={subreddit.image} />
        <div className="border-b pb-5" />
        <Editor id={subreddit.id} />
        <Button type="submit" className="w-full" form="subreddit-post-form">
          Post
        </Button>
      </div>
    )
  }