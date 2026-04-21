'use client'

import { useRecentSubreddits } from '@/hooks/useRecentSubreddits'
import { delay } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useAuth } from '../providers/auth-provider'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../sidebar'
import { SubredditAvatar } from '../subreddit/SubredditAvatar'
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
    if (!isLoggedIn||isLoading) return
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
        <p className="px-3">Loading...</p>
      )}
      {!isLoading && recent.length === 0 && (
        <p className="px-3">No recent</p>
      )}
      {recent.map(sub => (
        <SidebarMenuItem key={sub.id}>
          <SidebarMenuButton asChild className="hover:bg-accent">
            <Link href={`/r/${sub.name}`}>
              <SubredditAvatar subreddit={sub} size='sm' />
              <span>r/{sub.name}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}