
import { HomeIcon, Link } from "lucide-react";
import { useModal } from "@/components/ui/providers/modal-provider";

import { Button, buttonVariants } from "@/components/ui/Button";
import { getAuthToken } from "@/lib/auth";
import CustomFeedServer from "@/components/ui/post/CustomFeedServer";


const Home = async() => {
  const  token  = await getAuthToken()
  return   (
    <>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
        {token ? <CustomFeedServer /> : <div>Please log in</div>}
       
          {/* <dl className='-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6'>
            <div className='flex justify-between gap-x-4 py-3'>
              <p className='text-zinc-500'>
                Your personal Breadit frontpage. Come here to check in with your
                favorite communities.
              </p>
            </div>

            {/* <Link
              className={buttonVariants({
                className: 'w-full mt-4 mb-6',
              })}
              href={`/r/create`}>
              Create Community
            </Link> 
          </dl> */}
        </div>
    </>
  )
}
export default Home;