'use client'

import CreateSubReddit from '@/app/r/create/components/createSubReddit'
import Link from 'next/link'
import { useModal } from '../providers/modal-provider'
import { RecentSubreddits } from '../user/RecentSubreddits'
import { Home, Plus, Sparkle } from 'lucide-react'


interface Props {
}

export function LeftTab() {
  const { openModal, closeModal } = useModal()
  return (
    <div className="hidden md:flex flex-col gap-6 sticky top-20 text-sm px-5">

      <div className="flex flex-col gap-1 ">
        <p className="text-xs text-zinc-500 px-2">FEEDS</p>

        <Link href="/" className="px-3 py-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800">
          <div className='flex gap-1'>
          <Home className="w-5 h-5" />
          Home
          </div>
        </Link>

        <Link href="/r/all" className="px-3 py-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800">
           <div className='flex gap-1'>
         <Sparkle className="w-5 h-5" /> Everyone
         </div>
        </Link>
        <button onClick={() => openModal(<CreateSubReddit />)}className="px-3 py-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-left">
         <div className='flex gap-1'>
           <Plus className="w-5 h-5" /> Create a new community
          </div>
        </button>
      </div>

         {/* RECENT */}
        <RecentSubreddits/>

        {/* JOINED */}
      <div className="flex flex-col gap-1">
        <p className="text-xs text-zinc-500 px-2">FOLLOWING</p>

        {/* {joinedSubreddits.length === 0 && (
          <p className="px-3 text-zinc-400">No communities</p>
        )}

        {joinedSubreddits.map(sub => (
          <Link
            key={sub.name}
            href={`/r/${sub.name}`}
            className="px-3 py-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            r/{sub.name}
          </Link>
        ))} */}
      </div>

    
    </div>
  )
}