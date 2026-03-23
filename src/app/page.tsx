import { HomeIcon, Link } from "lucide-react"
import { useModal } from "@/components/ui/providers/modal-provider"

import { Button, buttonVariants } from "@/components/ui/Button"
import { getAuthToken } from "@/lib/auth"
import CustomFeedServer from "@/components/ui/post/CustomFeedServer"
import { LeftTab } from "@/components/ui/subreddit/LeftTab"

const Home = async () => {
  const token = await getAuthToken()

  return (
    <div className="min-h-screen dark:bg-[#0B1416] grid grid-cols-[16rem_minmax(0,1fr)]">
      {/* Left tab */}
      <div className="hidden lg:block border-r border-zinc-100">
        <LeftTab joinedSubreddits={[]} recentSubreddits={[]} />
      </div>

      {/* Right column */}
      <div className="py-6 w-full pl-14">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3 flex flex-col gap-4">
              {token ? <CustomFeedServer /> : <div>Please log in</div>}
            </div>
            {/* Optional: right sidebar  <maybeeee ?*/}
            <div className="col-span-1"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home