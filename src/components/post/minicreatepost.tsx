"use client"

import { Session } from "next-auth"
import { usePathname, useRouter } from "next/navigation"
import { UserAvatar } from "../ui/user/UserAvatar"

interface MiniCreatePostProps {
    session:Session | null
}
export default function MiniCreatePost ({session}:MiniCreatePostProps){
    const router = useRouter()
    const pathname = usePathname()

    return <li className='overflow-hidden rounded-md bg-white shadow'>
          <div className='h-full px-6 py-4 flex justify-between gap-6'>
            <div className='relative'>
              <UserAvatar
                user={{
                  name: session?.user.name || null,
                  image: session?.user.image || null,
                }}
              />
            </div>
            </div>
        </li>
}