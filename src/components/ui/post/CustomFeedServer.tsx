import { getAuthToken } from "@/lib/auth"
import { filterNull, getId } from "@/lib/utils"
import { getFeedPosts } from "@/server/services/subreddit/post/service"
import CustomFeed from "./CustomFeed"

const CustomFeedServer = async() =>{
    const token = await getAuthToken()
    if(!token) return null
    const userId= getId(token) 
    const initialPosts = filterNull(await getFeedPosts({userId}))
    return <CustomFeed initialPosts={initialPosts}></CustomFeed>
    
}
export default CustomFeedServer