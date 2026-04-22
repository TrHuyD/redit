import { getAuthToken } from "@/lib/auth"
import { filterNull, getId } from "@/lib/utils"
import { getUsersPosts } from "@/server/services/user/service"
import CustomFeed from "./CustomFeed"

interface Props{
    username:string
}
const CustomFeedServer = async(props:Props) =>{
    const {username} = await props
    const token = await getAuthToken()
    if(!token) return null
    const userId= getId(token) 
    const initialPosts = filterNull(await getUsersPosts({username,userId}))
    return <CustomFeed initialPosts={initialPosts} username={props.username}></CustomFeed>
    
}
export default CustomFeedServer