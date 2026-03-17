import { getSubreddit } from "@/lib/api/Subreddit/GetSubreddit"
import { notFound } from "next/navigation"
import  {Editor}  from "@/components/ui/Editor"
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
    return <Editor subredditId={subreddit.id}/>
  }