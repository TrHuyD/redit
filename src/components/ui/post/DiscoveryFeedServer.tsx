import { getAuthToken } from "@/lib/auth"
import DiscoveryFeed from "./DiscoveryFeed"
import { getAllPosts } from "@/server/services/subreddit/post/service"
import { getIdnull } from "@/lib/utils"

const DiscoveryFeedServer = async() =>{
    const token = await getAuthToken()
    const userId= getIdnull(token) 
    const initialPosts = await getAllPosts({userId})
    return <DiscoveryFeed initialPosts={initialPosts}></DiscoveryFeed>
    
}
export default DiscoveryFeedServer