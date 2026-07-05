"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Compass,
  Bookmark,
  History,
  Info,
  Shield,
  FolderHeart
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { useSearchStore } from "@/store/searchStore"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const bookmarks = useSearchStore(state => state.bookmarks);
  const collections = useSearchStore(state => state.collections);
  const recentSearches = useSearchStore(state => state.recentSearches);

  const data = {
    user: {
      name: "Ma'ruf Muchlisin",
      email: "muchlisinmaruf@gmail.com",
      avatar: "",
    },
    navMain: [
      {
        title: "Search Engine",
        url: "/",
        icon: Compass,
        isActive: true,
        items: [
          {
            title: "Search Home",
            url: "/",
          },
          {
            title: "Saved Bookmarks",
            url: "/settings",
          },
          {
            title: "Search History",
            url: "/settings",
          },
        ],
      },
      {
        title: "Settings & Options",
        url: "/settings",
        icon: Settings2,
        items: [
          {
            title: "Appearance Settings",
            url: "/settings",
          },
          {
            title: "Safe Search Filter",
            url: "/settings",
          },
          {
            title: "Region & Language",
            url: "/settings",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "About Lumio",
        url: "/about",
        icon: Info,
      },
      {
        title: "Privacy Policy",
        url: "/privacy",
        icon: Shield,
      },
    ],
    projects: collections.map((col) => ({
      name: col.name,
      url: "/settings",
      icon: FolderHeart,
    })),
  };

  return (
    <Sidebar variant="inset" {...props} className="font-sans border-r border-[#ececec]/70 dark:border-[#27272a]/70">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-accent text-white shadow-md shadow-accent/20">
                <Compass className="size-4 animate-spin-slow" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-extrabold text-gray-900 dark:text-[#fafafa]">Lumio</span>
                <span className="truncate text-xs text-gray-400 dark:text-zinc-500">2026 Search Client</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {data.projects.length > 0 && <NavProjects projects={data.projects} />}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
