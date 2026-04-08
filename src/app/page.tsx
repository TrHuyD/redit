
import { getAuthToken } from "@/lib/auth"
import CustomFeedServer from "@/components/ui/post/CustomFeedServer"
import { DiscoveryLayout } from "../components/ui/subreddit/DiscoveryLayout"
import DiscoveryFeedServer from "@/components/ui/post/DiscoveryFeedServer"


const Home = async () => {
  const token = await getAuthToken()

  return (
    <div className="min-h-screen   ">

      <DiscoveryLayout>
              {token ? <CustomFeedServer /> : <DiscoveryFeedServer/>}
      </DiscoveryLayout>
    </div>
  )
}

export default Home