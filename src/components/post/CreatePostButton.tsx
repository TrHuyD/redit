"use client"

import { Session } from "next-auth"
import { usePathname, useRouter } from "next/navigation"
import { UserAvatar } from "../ui/user/UserAvatar"
import { Input } from "../ui/input"
import { Button } from "../ui/Button"
import {Plus} from "lucide-react"

export default function CreatePostButton (){
    const router = useRouter()
    const pathname = usePathname()
    const segments = pathname.split("/").filter(Boolean)
    const base = segments.slice(0, 2).join("/")
   
    const submit = () => {
      router.push(`/${base}/submit`, undefined)
    }
    return <Button onClick={submit} variant="secondary" >
      <Plus />
      Create Post</Button>
    // return <li className='overflow-hidden rounded-md bg-white shadow'>
    //       <div className='h-full px-6 py-4 flex justify-between gap-6'>
    //         <div className='relative'>
    //           <UserAvatar
    //             user={{
    //               name: session?.user.name || null,
    //               image: session?.user.image || null,
    //             }}
    //           />
    //         </div>
    //         <Input  onSubmit={submit} placeholder="Create Post"/>
    //         </div>
    //     </li>
}