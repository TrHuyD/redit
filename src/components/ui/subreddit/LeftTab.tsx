"use client";

import CreateSubReddit from "@/app/r/create/components/createSubReddit";
import { Home, Plus, Sparkle } from "lucide-react";
import Link from "next/link";
import { useModal } from "../providers/modal-provider";
import { RecentSubreddits } from "../user/RecentSubreddits";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar";

const feeds = [
  { title: "Home", url: "/", icon: Home },
  { title: "Everyone", url: "/r/all", icon: Sparkle },
];

export function LeftTab({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { openModal } = useModal();

  return (
    <Sidebar collapsible="icon" className="pt-12" {...props}>
      <SidebarContent>
        {/* FEEDS */}
        <SidebarGroup>
          <SidebarGroupLabel>FEEDS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {feeds.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-accent">
                    <Link href={item.url}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => openModal(<CreateSubReddit />)} className="hover:bg-accent">
                  <Plus className="w-5 h-5" />
                  <span>Create a new community</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* RECENT */}
        <SidebarGroup>
          <SidebarGroupLabel>RECENT</SidebarGroupLabel>
          <SidebarGroupContent>
            <RecentSubreddits />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
