"use client"
import {User} from 'next-auth'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,DropdownMenuPortal, DropdownMenuItem,DropdownMenuSeparator } from '../dropdown-menu'
import { UserAvatar } from './UserAvatar'

import Link from "next/link"
import { signOut } from 'next-auth/react'
interface UserAccountNavProp 
{
    user:Pick<User,'name'|'image'|'email'>
}

export const UserAccountNav = ({ user }: UserAccountNavProp) => {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <UserAvatar user={user} />
        </DropdownMenuTrigger>
  
        <DropdownMenuPortal>
          <DropdownMenuContent
     
            align="end"
            sideOffset={8}
          >
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {user.name && <p className="font-medium">{user.name}</p>}
                {user.email && (
                  <p className="w-[200px] truncate text-sm text-zinc-700">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
          <DropdownMenuSeparator/>
          <DropdownMenuItem asChild>
            <Link href='/'> Feed</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/r/create'> Create Community </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/settings'> Settings </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(event)=>
            {
                event.preventDefault()
                signOut({callbackUrl:`${window.location.origin}/sign-in`})
            }
          }>
            Sign out
          </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    )
  }