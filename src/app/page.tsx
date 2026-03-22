
import { HomeIcon, Link } from "lucide-react";
import { useModal } from "@/components/ui/providers/modal-provider";

import { Button, buttonVariants } from "@/components/ui/Button";
import { getAuthToken } from "@/lib/auth";
import CustomFeedServer from "@/components/ui/post/CustomFeedServer";
import { LeftTab } from "@/components/ui/subreddit/LeftTab";


const Home = async() => {
  const  token  = await getAuthToken()
  return   (
    
    <div className="min-h-screen dark:bg-[#0B1416] grid grid-cols-[16rem_1fr]">
      <div className="hidden lg:block border-r border-zinc-200">
        <LeftTab joinedSubreddits={[]} recentSubreddits={[]} />
      </div>
      <div className="max-w-6xl mx-auto py-6">
          <div className="grid grid-cols-4">
            <div className="col-span-3 flex flex-col pr-2 gap-4">

              {token ? <CustomFeedServer /> : <div>Please log in</div>}
            </div>
      
        </div>
      </div>
    </div>
  )
}
export default Home;