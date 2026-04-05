'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../providers/auth-provider'
import axios from 'axios'
import { UserSubredditHistory } from '@/lib/validators/user'
import { SubRedditDto } from '@/types/subreddit'
import { SubredditAvatar } from '../subreddit/SubredditAvatar'
import { delay } from '@/lib/utils'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../sidebar'

export function RecentSubreddits() {
    const { isLoggedIn } = useAuth()
    const pathname = usePathname()
    const [recent, setRecent] = useState<SubRedditDto[]>([])
    const lastSlug = useRef<string | null>(null)

    async function load() {
        try {
        if(recent.length!=0)
        await delay(700);
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
        <SidebarMenu>
        {recent.length === 0 && (
            <p className="px-3 text-zinc-400">No recent</p>
        )}
        {recent.map(sub => (
            <SidebarMenuItem key={sub.Id}>
            <SidebarMenuButton asChild  className='hover:bg-accent'>
                <Link href={`/r/${sub.name}`}>
                <SubredditAvatar subreddit={sub} className='h-5 w-5' />
                <span>r/{sub.name}</span>
                </Link>
            </SidebarMenuButton>
            </SidebarMenuItem>
        ))}
        </SidebarMenu>
    )
}