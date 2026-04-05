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
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const feeds = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Everyone', url: '/r/all', icon: Sparkle },
]

export function LeftTab() {
  const { openModal } = useModal()

  return (

    <Sidebar collapsible='icon' className='pt-12'>
      <SidebarHeader>
      <SidebarTrigger className='pl-2' ></SidebarTrigger>
      </SidebarHeader>
      <SidebarContent>
      

        <SidebarGroup>
          <SidebarGroupLabel>FEEDS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {feeds.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => openModal(<CreateSubReddit />)}>
                  <Plus className="w-5 h-5" />
                  <span>Create a new community</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>RECENT</SidebarGroupLabel>
          <SidebarGroupContent>
            <RecentSubreddits />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>FOLLOWING</SidebarGroupLabel>
          <SidebarGroupContent />
        </SidebarGroup> 

      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}