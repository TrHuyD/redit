
import { notFound, redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { EditorCombo } from "./EditorCombo"
import { SubRedditDto } from "@/types/subreddit"
import { getSubredditId, getSubredditMetadata } from "@/server/services/subreddit/loader"

interface PageProps {
    params: Promise<{
      slug: string
    }>
  }
  
  export default async function Page({ params }: PageProps) {
    const { slug } = await params

    const id = await getSubredditId(slug)
    if(!id)
      return notFound()
    const subreddit = await getSubredditMetadata(id)
    if(!subreddit)
        return notFound()
    return (
      <div className="flex flex-col items-start gap-6 w-full max-w-3xl">

        <EditorCombo subreddit={ {...subreddit} as SubRedditDto}/>
        <Button type="submit" className="w-full" form="subreddit-post-form">
          Post
        </Button>
      </div>
    )
  }