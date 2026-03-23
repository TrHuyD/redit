
import { getAuthToken } from "@/lib/auth"

import DiscoveryFeedServer from "@/components/ui/post/DiscoveryFeedServer"
import { DiscoveryLayout } from "@/components/ui/subreddit/DiscoveryLayout"



const Home = async () => {
  const token = await getAuthToken()

  return (
    <div className="min-h-screen dark:bg-[#0B1416]  ">

      <DiscoveryLayout>
        <DiscoveryFeedServer/>        
      </DiscoveryLayout>
    </div>
  )
}

export default Home