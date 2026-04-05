'use client'

import Link from 'next/link'
import { useModal } from '../providers/modal-provider'
import CreateSubReddit from '@/app/r/create/components/createSubReddit'
import { RecentSubreddits } from '../user/RecentSubreddits'
import { Home, Plus, Sparkle } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar'

export function LeftTab() {
  const { openModal } = useModal()

  return (
    <Sidebar collapsible='icon' >
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>FEEDS</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/r/all">
                  <Sparkle className="w-5 h-5" />
                  <span>Everyone</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => openModal(<CreateSubReddit />)}>
                <Plus className="w-5 h-5" />
                <span>Create a new community</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* RECENT */}
        <SidebarGroup>
          <SidebarGroupLabel>RECENT</SidebarGroupLabel>
          <RecentSubreddits />
        </SidebarGroup>
        {/* FOLLOWING */}
        <SidebarGroup>
          <SidebarGroupLabel>FOLLOWING</SidebarGroupLabel>
          {/* future joined subs */}
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}