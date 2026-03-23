import { getSubreddit } from "@/server/services/subreddit/Get"
import { notFound } from "next/navigation"
import  Editor  from "@/components/ui/Editor"
import { SubredditSelector } from "../components/SubredditSelector"
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
      <div className='flex flex-col items-start gap-6'>
      {/* heading */}
      <SubredditSelector slug={slug}/>
      <div className='border-b  pb-5'>
      </div>
      <Editor id={subreddit.id}/>
      <div className='w-full flex justify-end'>
        <Button type='submit' className='w-full' form='subreddit-post-form'>
          Post
        </Button>
      </div>
      </div>
    )
  }