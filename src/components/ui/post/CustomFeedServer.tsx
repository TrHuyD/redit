import { getAuthToken } from "@/lib/auth"
import { getId } from "@/lib/utils"
import { getFeedPosts } from "@/server/services/subreddit/Get"
import CustomFeed from "./CustomFeed"

const CustomFeedServer = async() =>{
    const token = await getAuthToken()
    if(!token) return null
    const userId= getId(token) 
    const initialPosts = await getFeedPosts({userId})
    return <CustomFeed initialPosts={initialPosts}></CustomFeed>
    
}
export default CustomFeedServer