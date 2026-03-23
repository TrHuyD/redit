
import { getAuthToken } from "@/lib/auth"
import CustomFeedServer from "@/components/ui/post/CustomFeedServer"

interface Props {
  children: React.ReactNode
}

export  function DiscoveryLayout({ children }: Props)  {

  return (
    <div className="min-h-screen dark:bg-[#0B1416]  ">

      {/* Right column */}
      <div className="w-full pl-14">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3 flex flex-col gap-4">
              {children}
            </div>
            {/* Optional: right sidebar  <maybeeee ?*/}
            <div className="col-span-1"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

