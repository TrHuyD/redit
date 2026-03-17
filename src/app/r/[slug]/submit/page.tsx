import { getSubreddit } from "@/lib/api/Subreddit/GetSubreddit"
import { notFound } from "next/navigation"
import  {Editor}  from "@/components/ui/Editor"
import { SubredditSelector } from "../components/SubredditSelector"
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
      <SubredditSelector/>
      <div className='border-b  pb-5'>
        <div className='-ml-2 -mt-2 flex flex-wrap items-baseline'>
          <h3 className='ml-2 mt-2 text-base font-semibold leading-6 '>
            Create Post
          </h3>
          <p className='ml-2 mt-1 truncate text-sm'>in r/{slug}
          </p>
        </div>
      </div>
      <Editor subredditId={subreddit.id}/>
      </div>
    )
  }