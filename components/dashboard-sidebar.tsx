"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  FileText,
  Edit,
  BarChart3,
  Sparkles,
  LogOut,
  MessageCircle,
  Home,
  Info,
  Briefcase,
  Mail,
  BookOpen,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userEmail: string
}

export function DashboardSidebar({ userEmail, ...props }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  const dashboardNavItems = [
    {
      title: "Overview",
      href: "/blog-dashboard?tab=overview",
      icon: Home,
      isActive: pathname === "/blog-dashboard" && (!router.query || router.query.tab === "overview"),
    },
    {
      title: "All Posts",
      href: "/blog-dashboard?tab=posts",
      icon: FileText,
      isActive: pathname === "/blog-dashboard" && router.query?.tab === "posts",
    },
    {
      title: "Create/Edit Post",
      href: "/blog-dashboard?tab=create",
      icon: Edit,
      isActive: pathname === "/blog-dashboard" && router.query?.tab === "create",
    },
    {
      title: "Analytics",
      href: "/blog-dashboard?tab=analytics",
      icon: BarChart3,
      isActive: pathname === "/blog-dashboard" && router.query?.tab === "analytics",
    },
    {
      title: "AI Blog Generator",
      href: "/blog-dashboard?tab=ai-generate",
      icon: Sparkles,
      isActive: pathname === "/blog-dashboard" && router.query?.tab === "ai-generate",
    },
  ]

  const mainNavItems = [
    { title: "Home", href: "/", icon: Home },
    { title: "Services", href: "/services", icon: Briefcase },
    { title: "About", href: "/about", icon: Info },
    { title: "Blog Reader", href: "/blog-reader", icon: BookOpen },
    { title: "Contact", href: "/contact", icon: Mail },
    { title: "Messages", href: "/messages", icon: MessageCircle },
  ]

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center space-x-3">
          <img src="/images/7trendz-logo-final.png" alt="7Trendz Data Logo" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold text-gray-900">7Trendz Data</span>
        </Link>
        <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800">
          Welcome, {userEmail.split("@")[0]}
        </Badge>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Main Site</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarGroup className="p-4">
        <Button variant="outline" onClick={handleLogout} className="w-full flex items-center space-x-2 bg-transparent">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </SidebarGroup>

      <SidebarRail />
    </Sidebar>
  )
}
