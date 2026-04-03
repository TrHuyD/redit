'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../providers/auth-provider'
import axios from 'axios'
import { UserSubredditHistory } from '@/lib/validators/user'
import { SubRedditDto } from '@/types/subreddit'
import { SubredditAvatar } from '../subreddit/SubredditAvatar'

export function RecentSubreddits() {
    const { isLoggedIn } = useAuth()
    const pathname = usePathname()
    const [recent, setRecent] = useState<SubRedditDto[]>([])
    const lastSlug = useRef<string | null>(null)

    async function load() {
        try {
        const res = await axios.get('/api/subreddit/recent')
        const data = res.data as UserSubredditHistory
        setRecent(data.subreddits )
        } catch {}  
    }

    useEffect(() => {
        if (!isLoggedIn) return;
      
        if (pathname === "/") {
          if (lastSlug.current === "home") return;
          lastSlug.current = "home";
          load();
          return;
        }
      
        const match = pathname.match(/^\/r\/([^/]+)/);
        if (!match) return;
      
        const slug = match[1];
        if (lastSlug.current === slug) return;
      
        lastSlug.current = slug;
        load();
      }, [isLoggedIn, pathname]);
    return (
        <div className="flex flex-col gap-1">
        <p className="text-xs text-zinc-500 px-2">RECENT</p>

        {recent.length === 0 && (
            <p className="px-3 text-zinc-400">No recent</p>
        )}

        {recent.map(sub => (
            <Link
            key={sub.Id}
            href={`/r/${sub.name}`}
            className="px-3 py-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
            <div className='flex gap-1'>
            <SubredditAvatar subreddit={sub} className='h-5 w-5'/>
            r/{sub.name}
            </div>
            </Link>
        ))}
        </div>
    )
}