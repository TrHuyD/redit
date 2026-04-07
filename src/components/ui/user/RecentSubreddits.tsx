'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useAuth } from '../providers/auth-provider'
import { useQueryClient } from '@tanstack/react-query'
import { SubredditAvatar } from '../subreddit/SubredditAvatar'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../sidebar'
import { useRecentSubreddits } from '@/hooks/useRecentSubreddits'
import { delay } from '@/lib/utils'
export function RecentSubreddits() {
  const { isLoggedIn } = useAuth()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const { data: recent = [], isLoading } = useRecentSubreddits(isLoggedIn)
  const lastSlug = useRef<string | null>(null)
  async function load(){
    await delay(700);
    queryClient.invalidateQueries({ queryKey: ['recentSubreddits'] })

  }
  useEffect(() => {
    if (!isLoggedIn) return
    const match = pathname.match(/^\/r\/([^/]+)/)
    if (!match) return
    const slug = match[1]
    if (lastSlug.current === slug) return
    lastSlug.current = slug
    load()
  }, [isLoggedIn, pathname, queryClient])

  return (
    <SidebarMenu>
      {isLoading && (
        <p className="px-3 text-zinc-400">Loading...</p>
      )}
      {!isLoading && recent.length === 0 && (
        <p className="px-3 text-zinc-400">No recent</p>
      )}
      {recent.map(sub => (
        <SidebarMenuItem key={sub.Id}>
          <SidebarMenuButton asChild className="hover:bg-accent">
            <Link href={`/r/${sub.name}`}>
              <SubredditAvatar subreddit={sub} className="h-5 w-5" />
              <span>r/{sub.name}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}